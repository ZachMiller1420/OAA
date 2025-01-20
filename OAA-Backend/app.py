from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, text
import pandas as pd
import json

# Flask app setup
app = Flask(__name__)
CORS(app)

# Database configuration
DB_URL = "postgresql://youruser:yourpassword@asset-tracking-db:5432/asset_tracking"
engine = create_engine(DB_URL)

def init_db():
    """Initialize the database by creating the necessary table."""
    with engine.connect() as conn:
        conn.execute(text("""
        CREATE TABLE IF NOT EXISTS pipeline_state (
            id SERIAL PRIMARY KEY,
            step INT NOT NULL,
            dataset JSONB NOT NULL
        );
        """))
        conn.commit()

# Initialize the database
init_db()

# Load initial dataset
initial_dataset = pd.DataFrame({
    "Asset": ["A1", "A2", "A3", "A4"],
    "Latitude": [40.7128, 34.0522, 37.7749, 36.1627],
    "Longitude": [-74.0060, -118.2437, -122.4194, -86.7816],
    "OperationalStatus": ["Unknown", "Unknown", "Unknown", "Unknown"],
    "Speed": [20, 12, 15, 25],
    "Heading": [45, 5, 90, 135]
})

# Reset or initialize pipeline state in the database
def reset_pipeline_state():
    with engine.connect() as conn:
        conn.execute(text("DELETE FROM pipeline_state"))
        conn.execute(text("""
            INSERT INTO pipeline_state (step, dataset) 
            VALUES (:step, :dataset)
        """), {
            "step": 0,
            "dataset": json.dumps(initial_dataset.to_dict(orient="records"))
        })
        conn.commit()

reset_pipeline_state()

@app.route('/api/get_pipeline_stage', methods=['GET'])
def get_pipeline_stage():
    """Get the current stage of the pipeline."""
    with engine.connect() as conn:
        result = conn.execute(text("SELECT step, dataset FROM pipeline_state ORDER BY id DESC LIMIT 1")).fetchone()
        if result:
            return jsonify({"step": result.step, "dataset": result.dataset})
        else:
            return jsonify({"step": 0, "dataset": []})

@app.route('/api/process_next_stage', methods=['POST'])
def process_next_stage():
    """Move the dataset to the next stage in the pipeline."""
    with engine.connect() as conn:
        result = conn.execute(text("SELECT step, dataset FROM pipeline_state ORDER BY id DESC LIMIT 1")).fetchone()
        if not result:
            return jsonify({"status": "error", "message": "Pipeline state not initialized."})

        step = result.step
        dataset = pd.DataFrame(result.dataset)

        # Ensure the Speed column is numeric
        dataset["Speed"] = pd.to_numeric(dataset["Speed"], errors="coerce").fillna(0)

        if step == 0:
            # Determine operational status based on speed
            dataset["OperationalStatus"] = dataset["Speed"].apply(
                lambda x: "Operational" if x > 10 else "Not Operational" if x == 0 else "Unknown"
            )
            dataset.loc[(dataset["Speed"] > -10) & (dataset["Speed"] < 0), "OperationalStatus"] = "Unknown"
        elif step == 1:
            # Process Heading data (dummy transformation)
            dataset["Heading"] = (dataset["Heading"] + 10) % 360
        else:
            return jsonify({"status": "complete", "message": "All stages processed."})

        # Update pipeline state
        conn.execute(text("""
            INSERT INTO pipeline_state (step, dataset)
            VALUES (:step, :dataset)
        """), {
            "step": step + 1,
            "dataset": json.dumps(dataset.to_dict(orient="records"))
        })
        conn.commit()

        return jsonify({"status": "success", "dataset": dataset.to_dict(orient="records"), "step": step + 1})

@app.route('/api/update_pipeline_data', methods=['POST'])
def update_pipeline_data():
    """Update the dataset with user-modified data."""
    data = request.json.get('data', [])
    with engine.connect() as conn:
        conn.execute(text("""
            INSERT INTO pipeline_state (step, dataset)
            VALUES (:step, :dataset)
        """), {
            "step": 0,
            "dataset": json.dumps(data)
        })
        conn.commit()
    return jsonify({"status": "success", "message": "Pipeline data updated."})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)