# AI Response Backend Model Suggestions

## Database Schema for AI Responses

### 1. AI Response Model (MongoDB Schema)

```javascript
// AIResponse Schema
const aiResponseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true
  },
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  messages: [{
    id: String,
    type: {
      type: String,
      enum: ['user', 'ai'],
      required: true
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    charts: {
      type: {
        type: String,
        enum: ['bar', 'pie', 'area', 'line']
      },
      data: [{
        name: String,
        value: Number
      }],
      title: String
    },
    insights: [{
      icon: String,
      title: String,
      description: String
    }]
  }],
  metadata: {
    category: String,
    totalMessages: Number,
    lastActivity: Date,
    analysisType: String // 'trend', 'performance', 'forecast', 'recommendation'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better performance
aiResponseSchema.index({ userId: 1, fileId: 1 });
aiResponseSchema.index({ conversationId: 1 });
aiResponseSchema.index({ createdAt: -1 });
```

### 2. API Endpoints

```javascript
// AI Response Routes
router.post('/ai/conversations', createConversation);
router.get('/ai/conversations/:conversationId', getConversation);
router.post('/ai/conversations/:conversationId/messages', addMessage);
router.get('/ai/conversations/user/:userId', getUserConversations);
router.delete('/ai/conversations/:conversationId', deleteConversation);
```

### 3. Controller Functions

```javascript
// Create new conversation
const createConversation = async (req, res) => {
  try {
    const { userId, fileId } = req.body;
    
    const conversation = new AIResponse({
      userId,
      fileId,
      conversationId: generateConversationId(),
      messages: [],
      metadata: {
        category: req.body.category || 'General',
        totalMessages: 0,
        lastActivity: new Date(),
        analysisType: 'general'
      }
    });
    
    await conversation.save();
    res.status(201).json({ success: true, conversation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add message to conversation
const addMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { type, content, charts, insights } = req.body;
    
    const conversation = await AIResponse.findOne({ conversationId });
    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }
    
    const message = {
      id: generateMessageId(),
      type,
      content,
      timestamp: new Date(),
      charts,
      insights
    };
    
    conversation.messages.push(message);
    conversation.metadata.totalMessages = conversation.messages.length;
    conversation.metadata.lastActivity = new Date();
    
    await conversation.save();
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get conversation history
const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await AIResponse.findOne({ conversationId });
    
    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }
    
    res.json({ success: true, conversation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

### 4. Frontend Integration

```javascript
// Enhanced AIAnalyst with backend integration
const saveMessageToBackend = async (conversationId, message) => {
  try {
    const response = await axios.post(`/api/ai/conversations/${conversationId}/messages`, {
      type: message.type,
      content: message.content,
      charts: message.charts,
      insights: message.insights
    });
    return response.data;
  } catch (error) {
    console.error('Error saving message:', error);
  }
};

const loadConversationHistory = async (conversationId) => {
  try {
    const response = await axios.get(`/api/ai/conversations/${conversationId}`);
    return response.data.conversation.messages;
  } catch (error) {
    console.error('Error loading conversation:', error);
    return [];
  }
};
```

### 5. Additional Features

#### Conversation Analytics
```javascript
// Track conversation metrics
const conversationAnalytics = {
  totalConversations: Number,
  averageMessagesPerConversation: Number,
  mostCommonQuestions: [String],
  popularAnalysisTypes: [String],
  userEngagementMetrics: {
    averageSessionDuration: Number,
    returnUserRate: Number
  }
};
```

#### AI Response Caching
```javascript
// Cache frequent AI responses
const aiResponseCache = {
  questionHash: String,
  response: Object,
  category: String,
  usageCount: Number,
  lastUsed: Date
};
```

#### Export Functionality
```javascript
// Export conversation as PDF/CSV
const exportConversation = async (conversationId, format) => {
  const conversation = await getConversation(conversationId);
  
  if (format === 'pdf') {
    return generatePDFReport(conversation);
  } else if (format === 'csv') {
    return generateCSVReport(conversation);
  }
};
```

### 6. Security Considerations

```javascript
// Rate limiting for AI requests
const rateLimit = require('express-rate-limit');

const aiRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many AI requests from this IP'
});

// User authentication middleware
const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 7. Performance Optimizations

```javascript
// Pagination for large conversations
const getConversationWithPagination = async (req, res) => {
  const { conversationId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  
  const conversation = await AIResponse.findOne({ conversationId })
    .select('messages')
    .slice('messages', (page - 1) * limit, page * limit);
  
  res.json({ success: true, messages: conversation.messages });
};

// Aggregation for analytics
const getConversationAnalytics = async (req, res) => {
  const analytics = await AIResponse.aggregate([
    { $group: {
      _id: '$metadata.category',
      totalConversations: { $sum: 1 },
      avgMessages: { $avg: '$metadata.totalMessages' }
    }}
  ]);
  
  res.json({ success: true, analytics });
};
```

This model structure provides:
- ✅ Persistent storage of AI conversations
- ✅ Chart and insight data preservation
- ✅ Conversation history and analytics
- ✅ Export functionality
- ✅ Security and rate limiting
- ✅ Performance optimizations
- ✅ Scalable architecture 