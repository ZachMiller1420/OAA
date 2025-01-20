'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Progress, Input, Row, Col } from 'reactstrap';

type PipelineData = {
    Asset: string;
    Latitude: number;
    Longitude: number;
    OperationalStatus: string;
    Speed: number;
    Heading: number;
};

interface PipelineTransformationProps {
    pipelineData: PipelineData[];
    step: number;
}

const PipelineTransformation: React.FC<PipelineTransformationProps> = ({ pipelineData, step }) => {
    const [currentData, setCurrentData] = useState(pipelineData);
    const [transformedData, setTransformedData] = useState([...pipelineData]);
    const [currentStep, setCurrentStep] = useState(step);

    useEffect(() => {
        setTransformedData([...pipelineData]);
    }, [pipelineData]);

    const handleEdit = (index: number, key: keyof PipelineData, value: any) => {
        setTransformedData((prevData) => {
            const updatedData = [...prevData];
            updatedData[index] = { ...updatedData[index], [key]: value };
            return updatedData;
        });
    };

    const handleNextStep = async () => {
        const response = await fetch('http://127.0.0.1:5000/api/process_next_stage', {
            method: 'POST',
        });
        const data = await response.json();

        if (data.status === 'success') {
            setCurrentData(data.dataset);
            setCurrentStep(data.step);
        }
    };

    const updatePipelineData = async () => {
        try {
            await fetch('http://127.0.0.1:5000/api/update_pipeline_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: transformedData }),
            });
            alert('Pipeline data updated successfully!');
        } catch (err) {
            console.error('Error updating pipeline data:', err);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Pipeline Transformation</h2>

            <div className="mb-4">
                <h4>Step {currentStep + 1} of 3</h4>
                <Progress value={(currentStep + 1) * 33.33} max={100} />
                <div className="d-flex justify-content-between">
                    <span>Step 1</span>
                    <span>Step 2</span>
                    <span>Step 3</span>
                </div>
            </div>

            <div className="mb-4">
                <h3>Pipeline Data (Step {currentStep})</h3>
                <Table striped>
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Status</th>
                            <th>Speed</th>
                            <th>Heading</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.Asset}</td>
                                <td>{item.Latitude}</td>
                                <td>{item.Longitude}</td>
                                <td>{item.OperationalStatus}</td>
                                <td>
                                    <Input
                                        type="number"
                                        value={transformedData[index]?.Speed || item.Speed}
                                        onChange={(e) => handleEdit(index, 'Speed', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Input
                                        type="number"
                                        value={transformedData[index]?.Heading || item.Heading}
                                        onChange={(e) => handleEdit(index, 'Heading', e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Row>
                <Col>
                    <Button color="primary" onClick={handleNextStep}>
                        Process Next Stage
                    </Button>
                </Col>
                <Col>
                    <Button color="success" onClick={updatePipelineData}>
                        Update Pipeline Data
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default PipelineTransformation;

