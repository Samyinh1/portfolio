import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function MessageInbox() {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const esRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('portfolioToken');
    if (!token) return;

    const es = new EventSource(`${API_BASE}/contact/stream?token=${encodeURIComponent(token)}`);
    esRef.current = es;
    es.onopen = () => setConnected(true);
    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'history') setMessages(data.messages);
      else if (data.type === 'new') setMessages((prev) => [data.message, ...prev]);
    };
    es.onerror = () => setConnected(false);
    return () => es.close();
  }, []);

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={700}>Contact Messages</Typography>
        <Chip label={connected ? 'Live' : 'Offline'} color={connected ? 'success' : 'default'} size="small" fontWeight={700} />
      </Stack>

      {messages.length === 0 && (
        <Typography color="text.secondary" variant="body2">No messages yet.</Typography>
      )}

      <Stack spacing={1.5}>
        {messages.map((msg, i) => (
          <Card key={msg._id || i} variant="outlined" sx={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography fontWeight={700} variant="body2">{msg.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{msg.email}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {new Date(msg.createdAt).toLocaleString()}
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.65 }}>{msg.message}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
