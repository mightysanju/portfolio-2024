import React from 'react';
import BlogLayout from './BlogLayout';
//import PerformanceMetricsGraph from './NetworkappGraph';

const Networkapp = () => {
  return (
    <BlogLayout
      title="Network App"
      date="March 15, 2023"
      readTime="10 min read"
      tags={['Automation', 'Advanced SQL', 'Python']}
      image="https://i.imgur.com/VxGPpEB.png"
      //demoLink="https://agriculture.mightysanju.com"
      //githubLink="https://github.com/sanjukumarkanki/smart-agriculture"
    >
      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        Introduction
      </h2>
      <p className="text-gray-300 mb-6">
      Tired of the tedious manual tasks associated with network balancing SIMs? The Network App is here to revolutionize your workflow. This innovative tool automates data retrieval, email drafting, and communication, saving you time and effort.

      <br />By streamlining your processes, the Network App empowers you to focus on more strategic tasks and improve overall efficiency.
      </p>

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        The Problem Statement
      </h2>
      <p className="text-gray-300 mb-6">
      In our daily operations, a significant amount of time was spent on manual tasks related to network balancing SIMs. This involved pulling data from multiple sources, collating it, and then drafting and sending emails to FC for approvals. These manual processes were time-consuming, prone to errors, and hindered productivity.
      </p>

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        Solution: The Network App
      </h2>
      <p className="text-gray-300 mb-6">
      To streamline this process and improve efficiency, we developed the Network App. 
      This innovative tool leverages Python and SQL to automate the data retrieval and email drafting process. 
      By automating these tasks, we aim to:
      <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>
            <b>Intuitive GUI:</b> A simple and easy-to-use interface that
            empowers users to navigate the application effortlessly.
          </li>
          <li>
            <b>Reduce manual effort: </b> Eliminate repetitive tasks and free up employees to focus on more strategic work.
          </li>
          <li>
            <b>Improve accuracy: </b> Minimize errors associated with manual data entry and processing.
          </li>
          <li>
            <b>Accelerate communication: </b> Quickly and efficiently communicate vendor redirectable volume to FC.
          </li>
          <li>
            <b>Enhance productivity: </b> Streamline the workflow and reduce overall processing time.
          </li>
        </ul>
      </p>
      {/*----------Core Features */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">
          Core Features
        </h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Automated Data Retrieval</li>
          <li>Intelligant Email Drafting</li>
          <li>Improved Efficiency</li>
          <li>Reduced Manual Effort:</li>
          <li>Enhanced Productivity</li>
        </ul>
      </div>

          

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        How it works
      </h2>
      <p className="text-gray-300 mb-6">
      The Network App operates in a straightforward manner:<br />
      <ol className="list-decimal list-inside text-gray-300 space-y-2">
        <li>
          <b>Data Retrieval: </b>The app executes a SQL query to extract the necessary information from the database.
        </li>
        <li>
          <b>Email Drafting: </b>The retrieved data is then passed to a Python script, which automatically generates a well-formatted email.
        </li>
        <li>
          <b>Email Dispatch: </b>The generated email is sent to the designated recipients, providing timely and accurate communication.
        </li>
      </ol>
        
      </p>
      

      


      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">
        Pilot Results
        </h3>
        <p className="text-gray-300 mb-6">
        A pilot study was conducted to evaluate the performance of the Network App compared to the manual process. The results were impressive:
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>
            <b>Significant reduction in AHT: </b> The Network App reduced the average handling time (AHT) per SIM by over 94%.
          </li>
          <li>
            <b>Improved efficiency: </b>The automated process significantly accelerated the entire workflow.
          </li>
          <li>
            <b>Enhanced accuracy: </b>The risk of errors was minimized, ensuring accurate and reliable data.
          </li>
        </ul><br />
        {/*-------------------Table Introduction----------------*/}
      <div className="flex justify-center items-center p-4 ">
        <div className="w-full max-w-4xl bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700 text-gray-200">
                {['Total SIM', 'Time Taken', 'Total Time Human', 'Average time Human', 'Total Time Network app', 'Average time Network app', 'Network App Speed', 'AHT Saved by this Tool'].map((header, index) => (
                  <th key={index} className="px-4 py-3 text-sm font-semibold text-center">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700">
                <td rowSpan={2} className="bg-gray-900 text-center font-bold text-2xl p-4 text-gray-200">149</td>
                <td className="bg-gray-700 text-gray-200 text-center font-semibold p-3">Minutes</td>
                <td className="text-center p-3 text-gray-300">708.3</td>
                <td className="text-center p-3 text-gray-300">4.75</td>
                <td className="text-center p-3 text-gray-300">39.97</td>
                <td className="text-center p-3 text-gray-300">0.27</td>
                <td rowSpan={2} className="bg-gray-600 text-center font-bold p-4 text-gray-200">17.72x</td>
                <td rowSpan={2} className="bg-gray-600 text-center font-bold p-4 text-gray-200">94.36%</td>
              </tr>
              <tr>
                <td className="bg-gray-700 text-gray-200 text-center font-semibold p-3">Seconds</td>
                <td className="text-center p-3 text-gray-300">42498</td>
                <td className="text-center p-3 text-gray-300">285.22</td>
                <td className="text-center p-3 text-gray-300">2398.2</td>
                <td className="text-center p-3 text-gray-300">16.10</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>    

      </div>

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        Future Scope
      </h2>
      <p className="text-gray-300 mb-6">
      We are committed to continuously improving the Network App. Future enhancements will include:
      
      <ol className="list-decimal list-inside text-gray-300 space-y-2">
        <li>
          <b>Automatic email alias integration: </b>Simplifying the process of identifying origin and destination facilities.</li>
        <li>
          <b>Trailer tag status verification: </b>Ensuring that only eligible trailers are considered for redirection.</li>
        
      </ol><br />
      By implementing these features, we aim to further streamline operations, improve communication, and enhance safety and compliance. 
      </p>

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">Conclusion</h2>
      <p className="text-gray-300 mb-6">We are excited about the potential of the Network App to revolutionize our network balancing processes and look forward to its continued development and deployment.
      </p>
    </BlogLayout>
  );
};

export default Networkapp;