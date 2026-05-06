const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 模擬數據庫 (In-memory database for demo)
let tickets = [
  {
    id: 'TKT-001',
    title: '電腦無法開機',
    description: '課室 3A 的電腦無法開機，顯示黑屏',
    category: 'hardware',
    priority: 'high',
    status: 'open',
    submittedBy: '陳大文老師',
    department: '數學科',
    createdAt: new Date('2024-01-15T09:00:00Z'),
    updatedAt: new Date('2024-01-15T09:00:00Z'),
    assignedTo: null,
    resolution: null
  },
  {
    id: 'TKT-002',
    title: '投影機故障',
    description: '禮堂投影機顏色異常，需要維修',
    category: 'hardware',
    priority: 'medium',
    status: 'in_progress',
    submittedBy: '黃美蘭老師',
    department: '英文科',
    createdAt: new Date('2024-01-14T14:30:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    assignedTo: 'IT 技術員 - 李明',
    resolution: null
  },
  {
    id: 'TKT-003',
    title: '學生帳號密碼重設',
    description: '中三級學生帳號需要重設密碼',
    category: 'account',
    priority: 'low',
    status: 'resolved',
    submittedBy: '林志強老師',
    department: '學務處',
    createdAt: new Date('2024-01-13T11:00:00Z'),
    updatedAt: new Date('2024-01-14T16:00:00Z'),
    assignedTo: 'IT 技術員 - 王芳',
    resolution: '已成功重設密碼並通知相關老師'
  }
];

// 分類選項
const categories = [
  { value: 'hardware', label: '硬件問題' },
  { value: 'software', label: '軟件問題' },
  { value: 'network', label: '網絡問題' },
  { value: 'account', label: '帳號權限' },
  { value: 'email', label: '電郵系統' },
  { value: 'other', label: '其他' }
];

// 優先級選項
const priorities = [
  { value: 'low', label: '低', color: '#28a745' },
  { value: 'medium', label: '中', color: '#ffc107' },
  { value: 'high', label: '高', color: '#fd7e14' },
  { value: 'urgent', label: '緊急', color: '#dc3545' }
];

// 狀態選項
const statuses = [
  { value: 'open', label: '待處理' },
  { value: 'in_progress', label: '處理中' },
  { value: 'resolved', label: '已解決' },
  { value: 'closed', label: '已關閉' }
];

// API Routes

// 獲取所有工單
app.get('/api/tickets', (req, res) => {
  const { status, priority, category, search } = req.query;
  
  let filteredTickets = [...tickets];
  
  if (status) {
    filteredTickets = filteredTickets.filter(t => t.status === status);
  }
  
  if (priority) {
    filteredTickets = filteredTickets.filter(t => t.priority === priority);
  }
  
  if (category) {
    filteredTickets = filteredTickets.filter(t => t.category === category);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredTickets = filteredTickets.filter(t => 
      t.title.toLowerCase().includes(searchLower) ||
      t.description.toLowerCase().includes(searchLower) ||
      t.submittedBy.toLowerCase().includes(searchLower)
    );
  }
  
  // 按創建時間排序（最新的在前）
  filteredTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json(filteredTickets);
});

// 獲取單一工單
app.get('/api/tickets/:id', (req, res) => {
  const ticket = tickets.find(t => t.id === req.params.id);
  
  if (!ticket) {
    return res.status(404).json({ error: '工單不存在' });
  }
  
  res.json(ticket);
});

// 創建新工單
app.post('/api/tickets', (req, res) => {
  const { title, description, category, priority, submittedBy, department } = req.body;
  
  if (!title || !description || !category || !priority || !submittedBy) {
    return res.status(400).json({ error: '缺少必要欄位' });
  }
  
  const ticketNumber = `TKT-${String(tickets.length + 1).padStart(3, '0')}`;
  const now = new Date();
  
  const newTicket = {
    id: ticketNumber,
    title,
    description,
    category,
    priority,
    status: 'open',
    submittedBy,
    department: department || '',
    createdAt: now,
    updatedAt: now,
    assignedTo: null,
    resolution: null
  };
  
  tickets.push(newTicket);
  res.status(201).json(newTicket);
});

// 更新工單
app.put('/api/tickets/:id', (req, res) => {
  const ticketIndex = tickets.findIndex(t => t.id === req.params.id);
  
  if (ticketIndex === -1) {
    return res.status(404).json({ error: '工單不存在' });
  }
  
  const { status, assignedTo, resolution, priority } = req.body;
  
  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    status: status !== undefined ? status : tickets[ticketIndex].status,
    assignedTo: assignedTo !== undefined ? assignedTo : tickets[ticketIndex].assignedTo,
    resolution: resolution !== undefined ? resolution : tickets[ticketIndex].resolution,
    priority: priority !== undefined ? priority : tickets[ticketIndex].priority,
    updatedAt: new Date()
  };
  
  res.json(tickets[ticketIndex]);
});

// 刪除工單
app.delete('/api/tickets/:id', (req, res) => {
  const ticketIndex = tickets.findIndex(t => t.id === req.params.id);
  
  if (ticketIndex === -1) {
    return res.status(404).json({ error: '工單不存在' });
  }
  
  tickets.splice(ticketIndex, 1);
  res.json({ message: '工單已成功刪除' });
});

// 獲取統計數據
app.get('/api/stats', (req, res) => {
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length,
    byPriority: {
      urgent: tickets.filter(t => t.priority === 'urgent').length,
      high: tickets.filter(t => t.priority === 'high').length,
      medium: tickets.filter(t => t.priority === 'medium').length,
      low: tickets.filter(t => t.priority === 'low').length
    },
    byCategory: categories.map(cat => ({
      category: cat.value,
      label: cat.label,
      count: tickets.filter(t => t.category === cat.value).length
    }))
  };
  
  res.json(stats);
});

// 獲取選項列表
app.get('/api/options', (req, res) => {
  res.json({
    categories,
    priorities,
    statuses
  });
});

// AI 分析工單分類和優先級
app.post('/api/analyze-ticket', (req, res) => {
  const { title, description } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: '缺少標題或描述' });
  }
  
  const text = `${title} ${description}`.toLowerCase();
  
  // 簡單的基於規則的 AI 分析（可替換為真實的 AI API）
  let category = 'other';
  let priority = 'medium';
  let confidence = 0.7;
  let reasoning = [];
  
  // 分類分析 (按特定性排序，更具體的分類在前)
  const emailKeywords = ['電郵', 'email', 'outlook', '郵件', '信箱'];
  const accountKeywords = ['帳號', '密碼', 'login', 'account', '權限', '登入', '重設'];
  const networkKeywords = ['網絡', 'wifi', 'internet', 'network', '連線', '斷線', 'ip'];
  const softwareKeywords = ['軟件', '程式', 'application', 'software', '安裝', '更新', 'version'];
  const hardwareKeywords = ['電腦', '硬件', 'printer', '投影機', '螢幕', '鍵盤', '滑鼠', 'hardware', 'computer', 'device'];
  
  if (emailKeywords.some(k => text.includes(k))) {
    category = 'email';
    reasoning.push('檢測到電郵系統相關關鍵詞');
  } else if (accountKeywords.some(k => text.includes(k))) {
    category = 'account';
    reasoning.push('檢測到帳號相關關鍵詞');
  } else if (networkKeywords.some(k => text.includes(k))) {
    category = 'network';
    reasoning.push('檢測到網絡相關關鍵詞');
  } else if (softwareKeywords.some(k => text.includes(k))) {
    category = 'software';
    reasoning.push('檢測到軟件相關關鍵詞');
  } else if (hardwareKeywords.some(k => text.includes(k))) {
    category = 'hardware';
    reasoning.push('檢測到硬件相關關鍵詞');
  }
  
  // 優先級分析
  const urgentKeywords = ['緊急', 'urgent', '無法運作', '完全不能用', '影響考試', '影響教學', '全部', 'every', 'all'];
  const highKeywords = ['重要', 'high', '盡快', '急', '嚴重', 'critical'];
  const lowKeywords = ['低', 'low', '有空再處理', '不急', 'minor'];
  
  if (urgentKeywords.some(k => text.includes(k))) {
    priority = 'urgent';
    reasoning.push('檢測到緊急情況關鍵詞');
    confidence = 0.9;
  } else if (highKeywords.some(k => text.includes(k))) {
    priority = 'high';
    reasoning.push('檢測到高優先級關鍵詞');
    confidence = 0.8;
  } else if (lowKeywords.some(k => text.includes(k))) {
    priority = 'low';
    reasoning.push('檢測到低優先級關鍵詞');
    confidence = 0.85;
  }
  
  // 如果沒有明確的關鍵詞，提供默認推理
  if (reasoning.length === 0) {
    reasoning.push('基於問題描述進行默認分類');
  }
  
  res.json({
    category,
    priority,
    confidence,
    reasoning: reasoning.join('; ')
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 香港學校 IT Service Desk API 運行中...`);
  console.log(`📍 伺服器地址：http://localhost:${PORT}`);
  console.log(`📋 API 端點:`);
  console.log(`   GET    /api/tickets      - 獲取所有工單`);
  console.log(`   GET    /api/tickets/:id  - 獲取單一工單`);
  console.log(`   POST   /api/tickets      - 創建工單`);
  console.log(`   PUT    /api/tickets/:id  - 更新工單`);
  console.log(`   DELETE /api/tickets/:id  - 刪除工單`);
  console.log(`   GET    /api/stats        - 獲取統計數據`);
  console.log(`   GET    /api/options      - 獲取選項列表`);
  console.log(`   POST   /api/analyze-ticket - AI 分析工單分類和優先級`);
});
