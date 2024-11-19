import React from 'react';
import BlogLayout from './BlogLayout';

const AIImageRecognition = () => {
  return (
    <BlogLayout
      title="Building an AI-Powered Image Recognition System"
      date="March 15, 2024"
      readTime="10 min read"
      tags={['Machine Learning', 'Computer Vision', 'TensorFlow']}
      image="https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80"
      demoLink="https://agriculture.mightysanju.com"
      githubLink="https://github.com/sanjukumarkanki/smart-agriculture"
    >
      <p className="text-gray-300 mb-6">
        In this article, we'll explore how we built a state-of-the-art image recognition system
        using deep learning techniques and TensorFlow. We'll cover the architecture, training process,
        and deployment strategies used to achieve high accuracy in real-time object detection.
      </p>

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">The Challenge</h2>
      <p className="text-gray-300 mb-6">
        Real-time object detection presents unique challenges in terms of accuracy and performance.
        We needed to balance model complexity with inference speed while maintaining high accuracy
        across diverse scenarios.
      </p>

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">Our Approach</h2>
      <p className="text-gray-300 mb-6">
        We utilized transfer learning with a pre-trained EfficientNet backbone, fine-tuned on our
        custom dataset. This approach allowed us to leverage existing feature extractors while
        optimizing for our specific use case.
      </p>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">Key Features</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Real-time object detection with 95% accuracy</li>
          <li>Support for multiple object classes</li>
          <li>Optimized for edge devices</li>
          <li>Automated model retraining pipeline</li>
        </ul>
      </div>
    </BlogLayout>
  );
};

export default AIImageRecognition;