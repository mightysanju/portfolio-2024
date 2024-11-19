import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, GraduationCap, Briefcase, Star, Shield, Heart, 
  Award, Code2, Brain, Target, Users, Lightbulb, Globe
} from 'lucide-react';

const About = () => {
  const education = [
    {
      degree: "Master's in Computer Science",
      school: "Illinois Institute of Technology",
      period: "2023 - Present",
      description: "Specializing in Data Science and Machine Learning",
      courses: [
        "Advanced Machine Learning",
        "Deep Learning & Neural Networks",
        "Big Data Analytics",
        "Natural Language Processing",
        "Computer Vision"
      ],
      gpa: "3.9/4.0"
    },
    {
      degree: "Bachelor's in Computer Science",
      school: "JNTUH College of Engineering",
      period: "2015 - 2019",
      description: "Focused on Software Engineering and Data Structures",
      courses: [
        "Data Structures & Algorithms",
        "Database Management Systems",
        "Operating Systems",
        "Computer Networks",
        "Software Engineering"
      ],
      gpa: "3.8/4.0",
      achievements: [
        "Department Topper",
        "Best Project Award",
        "Technical Club Lead"
      ]
    }
  ];

  const experience = [
    {
      role: "Data Scientist",
      company: "Amazon",
      period: "2019 - 2023",
      location: "Seattle, WA",
      achievements: [
        "Led machine learning initiatives for inventory optimization, reducing stockouts by 35%",
        "Developed predictive models for demand forecasting with 92% accuracy",
        "Implemented automated data pipelines for real-time analytics, processing 1M+ records daily",
        "Mentored 5 junior data scientists and led a team of 3 ML engineers",
        "Received 2 Spot Awards for exceptional performance"
      ],
      technologies: [
        "Python", "TensorFlow", "PyTorch", "AWS", "SQL",
        "Apache Spark", "Kubernetes", "Docker"
      ]
    },
    {
      role: "ML Engineering Intern",
      company: "Microsoft",
      period: "2018 - 2019",
      location: "Redmond, WA",
      achievements: [
        "Developed NLP models for text classification with 88% accuracy",
        "Contributed to the Azure ML platform's feature engineering pipeline",
        "Optimized model training pipelines, reducing training time by 40%",
        "Presented findings at internal tech conferences",
        "Extended internship due to exceptional performance"
      ],
      technologies: [
        "Python", "Azure ML", "BERT", "FastAPI", "MongoDB",
        "Docker", "Git", "CI/CD"
      ]
    }
  ];

  const skills = {
    technical: [
      "Python", "TensorFlow", "PyTorch", "Scikit-learn",
      "SQL", "AWS", "Azure", "Docker", "Kubernetes",
      "Git", "REST APIs", "Microservices"
    ],
    ml: [
      "Deep Learning", "NLP", "Computer Vision",
      "Reinforcement Learning", "Time Series Analysis",
      "Feature Engineering", "Model Optimization"
    ],
    soft: [
      "Leadership", "Problem Solving", "Communication",
      "Team Management", "Mentoring", "Project Planning"
    ]
  };

  const strengths = [
    {
      title: "Problem-solving Excellence",
      description: "Strong analytical mindset with proven track record in solving complex technical challenges"
    },
    {
      title: "Technical Leadership",
      description: "Experience in leading and mentoring teams while driving technical initiatives"
    },
    {
      title: "Fast Learner",
      description: "Quick to adapt to new technologies and methodologies"
    },
    {
      title: "Communication",
      description: "Excellent in translating technical concepts to non-technical stakeholders"
    },
    {
      title: "Mathematical Foundation",
      description: "Strong background in statistics, calculus, and linear algebra"
    }
  ];

  const areasOfImprovement = [
    {
      area: "Public Speaking",
      plan: "Actively participating in tech conferences and meetups"
    },
    {
      area: "Work-life Balance",
      plan: "Implementing structured time management techniques"
    },
    {
      area: "Perfectionism",
      plan: "Learning to balance perfect vs good enough through agile methodologies"
    },
    {
      area: "Detail Focus",
      plan: "Developing better high-level strategic thinking skills"
    }
  ];

  const interests = [
    "Artificial General Intelligence",
    "Quantum Computing",
    "Robotics",
    "Sustainable Technology",
    "Edge Computing"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <div
            className="absolute inset-0 animate-nebula"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))',
              filter: 'blur(40px)',
            }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <Link 
          to="/"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          About Me
        </h1>

        <div className="space-y-12">
          {/* Education Section */}
          <section>
            <div className="flex items-center mb-6">
              <GraduationCap className="w-6 h-6 text-purple-400 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-200">Education</h2>
            </div>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm
                    hover:transform hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-200">{edu.degree}</h3>
                      <p className="text-purple-400">{edu.school}</p>
                      <p className="text-gray-400 text-sm">{edu.period}</p>
                    </div>
                    <span className="text-emerald-400 font-semibold">GPA: {edu.gpa}</span>
                  </div>
                  <p className="text-gray-300 mb-4">{edu.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Courses</h4>
                    <div className="flex flex-wrap gap-2">
                      {edu.courses.map((course, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>

                  {edu.achievements && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Achievements</h4>
                      <ul className="space-y-1">
                        {edu.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-center text-gray-300">
                            <Award className="w-4 h-4 text-yellow-400 mr-2" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section>
            <div className="flex items-center mb-6">
              <Briefcase className="w-6 h-6 text-purple-400 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-200">Experience</h2>
            </div>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm
                    hover:transform hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-200">{exp.role}</h3>
                      <p className="text-purple-400">{exp.company}</p>
                      <p className="text-gray-400 text-sm">{exp.period}</p>
                    </div>
                    <span className="text-gray-400 flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      {exp.location}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Achievements</h4>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start text-gray-300">
                          <Star className="w-4 h-4 text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section>
            <div className="flex items-center mb-6">
              <Code2 className="w-6 h-6 text-purple-400 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-200">Skills</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <Code2 className="w-5 h-5 text-blue-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-200">Technical</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.technical.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <Brain className="w-5 h-5 text-purple-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-200">Machine Learning</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.ml.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <Users className="w-5 h-5 text-green-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-200">Soft Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.soft.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Strengths Section */}
          <section>
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-purple-400 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-200">Core Strengths</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {strengths.map((strength, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm
                    hover:transform hover:scale-[1.02] transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">{strength.title}</h3>
                  <p className="text-gray-300">{strength.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Areas of Improvement Section */}
          <section>
            <div className="flex items-center mb-6">
              <Target className="w-6 h-6 text-purple-400 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-200">Growth Areas & Action Plans</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {areasOfImprovement.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm"
                >
                  <h3 className="text-lg font-semibold text-blue-300 mb-2">{item.area}</h3>
                  <p className="text-gray-300">{item.plan}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Interests Section */}
          <section>
            <div className="flex items-center mb-6">
              <Lightbulb className="w-6 h-6 text-purple-400 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-200">Research Interests</h2>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm">
              <div className="flex flex-wrap gap-3">
                {interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-300 text-sm
                      border border-yellow-500/30"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;