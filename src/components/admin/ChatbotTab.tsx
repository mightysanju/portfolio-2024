import React from 'react';
import { Plus } from 'lucide-react';
import { usePortfolio, type ChatbotConfig, type ChatbotKnowledgeEntry } from '../../context/PortfolioContext';
import { BTN_PRIMARY, BTN_SECONDARY, BTN_DANGER, CARD_CLASS, INPUT_CLASS, LABEL_CLASS } from './adminStyles';

export const ChatbotTab: React.FC = () => {
  const { data, updateData } = usePortfolio();
  
  const chatbotConfig: ChatbotConfig = data.chatbot || {
    assistantName: 'Ask Sanju',
    apiUrl: 'https://flaskragbot-1e1040a057f8.herokuapp.com/api/query',
    mode: 'hybrid',
    presetQuestions: [],
    systemContext: '',
    knowledgeEntries: [],
  };

  const handleUpdateChatbot = (patch: Partial<ChatbotConfig>) => {
    updateData((prev) => ({
      ...prev,
      chatbot: {
        ...(prev.chatbot || chatbotConfig),
        ...patch,
      },
    }));
  };

  const handleAddKnowledgeEntry = () => {
    const newEntry: ChatbotKnowledgeEntry = {
      id: `kb-${Date.now()}`,
      topic: 'New knowledge topic',
      keywords: [],
      answer: '...',
    };
    handleUpdateChatbot({
      knowledgeEntries: [newEntry, ...(chatbotConfig.knowledgeEntries || [])],
    });
  };

  return (
    <div className="space-y-6">
      <div className={CARD_CLASS}>
        <h2 className="text-lg font-medium text-[#eef0f5] mb-4">Chatbot Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS}>Assistant Name</label>
            <input 
              type="text" 
              value={chatbotConfig.assistantName} 
              onChange={(e) => handleUpdateChatbot({ assistantName: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>API URL</label>
            <input 
              type="text" 
              value={chatbotConfig.apiUrl} 
              onChange={(e) => handleUpdateChatbot({ apiUrl: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Mode</label>
            <select 
              value={chatbotConfig.mode} 
              onChange={(e) => handleUpdateChatbot({ mode: e.target.value as ChatbotConfig['mode'] })}
              className={INPUT_CLASS}
            >
              <option value="hybrid">Hybrid</option>
              <option value="local_cms">Local CMS Only</option>
              <option value="external_api">External API Only</option>
            </select>
          </div>
          <div>
            <label className={LABEL_CLASS}>System Context</label>
            <textarea 
              value={chatbotConfig.systemContext} 
              onChange={(e) => handleUpdateChatbot({ systemContext: e.target.value })}
              className={`${INPUT_CLASS} min-h-[100px]`}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Preset Questions</label>
            <div className="space-y-2 mt-2">
              {chatbotConfig.presetQuestions.map((q, i) => (
                <div key={i} className="flex gap-2">
                  <input 
                    type="text" 
                    value={q} 
                    onChange={(e) => {
                      const newQuestions = [...chatbotConfig.presetQuestions];
                      newQuestions[i] = e.target.value;
                      handleUpdateChatbot({ presetQuestions: newQuestions });
                    }}
                    className={INPUT_CLASS}
                  />
                  <button onClick={() => handleUpdateChatbot({ presetQuestions: chatbotConfig.presetQuestions.filter((_, idx) => idx !== i) })} className={BTN_DANGER}>Delete</button>
                </div>
              ))}
              <button 
                onClick={() => handleUpdateChatbot({ presetQuestions: [...chatbotConfig.presetQuestions, ''] })}
                className={BTN_SECONDARY}
              >
                + Add Preset Question
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={CARD_CLASS}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-[#eef0f5]">Knowledge Base</h2>
          <button onClick={handleAddKnowledgeEntry} className={BTN_PRIMARY}><Plus className="w-4 h-4"/>Add Entry</button>
        </div>
        <div className="space-y-4">
          {(chatbotConfig.knowledgeEntries || []).map((entry, index) => (
            <div key={entry.id} className="p-4 bg-[#1a1e28]/50 rounded-lg border border-white/[0.05]">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block text-xs font-medium text-[#7a8296] mb-1 uppercase">Topic</label>
                  <input 
                    type="text" 
                    value={entry.topic}
                    onChange={(e) => {
                      const newEntries = [...chatbotConfig.knowledgeEntries];
                      newEntries[index] = { ...entry, topic: e.target.value };
                      handleUpdateChatbot({ knowledgeEntries: newEntries });
                    }}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#7a8296] mb-1 uppercase">Keywords (comma-separated)</label>
                  <input 
                    type="text" 
                    value={entry.keywords.join(', ')}
                    onChange={(e) => {
                      const newEntries = [...chatbotConfig.knowledgeEntries];
                      newEntries[index] = { ...entry, keywords: e.target.value.split(',').map(s => s.trim()) };
                      handleUpdateChatbot({ knowledgeEntries: newEntries });
                    }}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#7a8296] mb-1 uppercase">Answer</label>
                <textarea 
                  value={entry.answer}
                  onChange={(e) => {
                    const newEntries = [...chatbotConfig.knowledgeEntries];
                    newEntries[index] = { ...entry, answer: e.target.value };
                    handleUpdateChatbot({ knowledgeEntries: newEntries });
                  }}
                  className={`${INPUT_CLASS} min-h-[80px]`}
                />
              </div>
              <button 
                onClick={() => {
                  handleUpdateChatbot({ 
                    knowledgeEntries: chatbotConfig.knowledgeEntries.filter((_, i) => i !== index) 
                  });
                }}
                className={BTN_DANGER}
              >
                Delete Entry
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
