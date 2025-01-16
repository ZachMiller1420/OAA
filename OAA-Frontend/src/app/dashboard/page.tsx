import React from 'react';
import PipelineTransformation from '@/components/PipelineTransformation';
import 'bootstrap/dist/css/bootstrap.min.css';

const Page = async () => {
    const response = await fetch('http://127.0.0.1:5000/get_pipeline_stage');
    const data = await response.json();
    const pipelineData = Array.isArray(data.dataset) ? data.dataset : [];
    const step = data.step ?? 1;

    return (
        <div>
            <h1>Pipeline Data Transformation Page</h1>
            <PipelineTransformation pipelineData={pipelineData} step={step} />
        </div>
    );
};

export default Page;

