import React from 'react';
import BlogLayout from './BlogLayout';
import Stakeholder from './stakeholder';

const DDO = () => {
  //Declaring Stake Holders
  const stakeholders = [
    {
      name: "Jake Porter",
      role: "Global Logistics | Prepaid Transportation",
      company: "Amazon",
      linkedinUrl: "https://www.linkedin.com/in/jake-porter-20083b257/",
      imageUrl: "https://media.licdn.com/dms/image/v2/D5603AQEgbMCz8YxCGQ/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1706211347116?e=1738195200&v=beta&t=Xlawp-1UnbR3RdtKzYaSDoRs-BQYGXEu8VwV2uixcF0",
      contribution: "Jake Porter - The Project Sponsor for the Defect Dispute override tool"
    },
    {
      name: "Jayadev Addepalli",
      role: "Supply Chain Manager at Amazon",
      company: "Amazon",
      linkedinUrl: "https://www.linkedin.com/in/jdaddepalli/",
      imageUrl: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png",
      contribution: "Jayadev Addepalli - The Project Manager for the Defect Dispute override tool"
    }
  ];


  return (
    <BlogLayout
      title="Defect Dispute Override Tool"
      date="March 10, 2023"
      readTime="8 min read"
      tags={['Data Science', 'Machine Learning', 'Analytics']}
      image="https://i.imgur.com/pqH8SRU.png"
      //demoLink="https://sentiment.mightysanju.com"
      githubLink="https://github.com/mightysanju/DDO-Tool-Code-for-Public"
    >
      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        Introduction
      </h2>
      <p className="text-gray-300 mb-6">
        In the realm of logistics and supply chain management, accurate carrier
        performance evaluation is paramount. Discrepancies in carrier rankings
        can lead to significant financial implications and operational
        inefficiencies. To address this challenge, I developed the Defect
        Dispute Override Tool (DDO), a Windows desktop application designed to
        streamline the process of identifying and resolving carrier performance
        issues.
      </p>

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        The Problem Statement
      </h2>
      <p className="text-gray-300 mb-6">
        Before the introduction of DDO, the process of handling carrier disputes
        and defects was manual and time-consuming. Associates were burdened with
        the task of manually recording and analyzing disputes over the phone,
        often leading to errors and delays. To alleviate this issue, a more
        efficient and automated solution was necessary.
      </p>

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        Solution: The DDO Tool
      </h2>
      <p className="text-gray-300 mb-6">
        DDO is a Python-based application built using the Tkinter library,
        offering a user-friendly graphical user interface (GUI). It leverages
        SQL for seamless database interaction, enabling real-time data retrieval
        and updates.
      </p>

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        Key Features
      </h2>
      <p className="text-gray-300 mb-6">
        DDO is a Python-based application built using the Tkinter library,
        offering a user-friendly graphical user interface (GUI). It leverages
        SQL for seamless database interaction, enabling real-time data retrieval
        and updates.
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>
            <b>Intuitive GUI:</b> A simple and easy-to-use interface that
            empowers users to navigate the application effortlessly.
          </li>
          <li>
            <b>Efficient Data Processing:</b> Multithreading and multiprocessing
            techniques ensure a responsive user experience, even during
            intensive data processing tasks.
          </li>
          <li>
            <b>Real-time Data Analysis:</b> The application can analyze carrier
            performance data in real-time, allowing for timely decision-making.
          </li>
          <li>
            <b>Automated Dispute Resolution:</b> DDO streamlines the dispute
            resolution process by automating data entry and analysis.
          </li>
          <li>
            <b>Accurate Carrier Ranking:</b> By identifying and correcting
            discrepancies, DDO helps to ensure accurate carrier rankings.
          </li>
        </ul>
      </p>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">
          Core Features
        </h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Real-time data processing</li>
          <li>Multi Processing & Multi Threading</li>
          <li>User Friendly Graphic Interface</li>
          <li>One Click Data Fetch and Upload</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        Technical Implementation
      </h2>

      <p className="text-gray-300 mb-6">
        The development of DDO involved a combination of Python programming
        skills, SQL database expertise, and a deep understanding of concurrency
        concepts. Key technical aspects of the project include: <br />
        <li>
          <b>Python Programming:</b> Utilizing Python's Tkinter library for GUI
          development, core Python functionalities for data manipulation and
          processing, and SQL for database interactions.
        </li>
        <li>
          <b>Concurrency:</b> Implementing multithreading and multiprocessing
          techniques to optimize performance and responsiveness.
        </li>
      </p>

      

      

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">
          Impact and Results
        </h3>
        <p className="text-gray-300 mb-6">
          The successful deployment of DDO has yielded significant benefits:
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>
            <b>Reduced Discrepancies:</b> A 70% reduction in carrier ranking
            discrepancies, leading to improved accuracy and fairness in carrier
            evaluations.
          </li>
          <li>
            Enhanced Efficiency: 100% efficiency in root cause identification,
            enabling faster resolution of disputes and minimizing operational
            disruptions.
          </li>
          <li>
            Streamlined Workflows: Automated data entry and analysis have
            streamlined workflows, saving time and effort for associates.
          </li>
          <li>
            Improved Decision-Making: Real-time data analysis empowers
            stakeholders to make informed decisions.
          </li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">Conclusion</h2>
      <p className="text-gray-300 mb-6">
        DDO is a powerful tool that has revolutionized the way carrier
        performance issues are handled. By leveraging advanced technologies and
        a user-centric design, this application has significantly improved
        efficiency, accuracy, and decision-making within the organization. This
        project showcases my ability to develop innovative solutions that
        address real-world business problems and deliver tangible results.
      </p>

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">Project Stakeholders</h2>
      <div className="grid gap-6 mb-6">
        {stakeholders.map((stakeholder, index) => (
          <Stakeholder key={index} {...stakeholder} />
        ))}
      </div>

    </BlogLayout>
  );
};

export default DDO;
