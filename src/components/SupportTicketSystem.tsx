import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  MessageSquare, Clock, CheckCircle, AlertCircle, 
  User, ArrowRight, Plus 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'Order not delivered',
    description: 'My order #12345 was supposed to arrive 3 days ago but still not received.',
    status: 'in_progress',
    priority: 'high',
    category: 'Orders',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    assignedTo: 'Support Agent',
  },
  {
    id: 'TKT-002',
    subject: 'Refund request for damaged item',
    description: 'Received a damaged laptop. Need a refund or replacement.',
    status: 'open',
    priority: 'urgent',
    category: 'Returns',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
  },
  {
    id: 'TKT-003',
    subject: 'Account verification issue',
    description: 'Cannot verify my seller account. Documents uploaded but still pending.',
    status: 'resolved',
    priority: 'medium',
    category: 'Account',
    createdAt: '2024-01-10T15:45:00Z',
    updatedAt: '2024-01-14T11:30:00Z',
    assignedTo: 'Support Agent',
  },
];

export function SupportTicketSystem() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'medium' as const,
  });

  const getStatusIcon = (status: Ticket['status']) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'closed': return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: Ticket['status']) => {
    const colors = {
      open: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      in_progress: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      resolved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      closed: 'bg-muted text-muted-foreground border-border',
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    const colors = {
      low: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
      medium: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      high: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      urgent: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return colors[priority];
  };

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.description || !newTicket.category) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const ticket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      ...newTicket,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({ subject: '', description: '', category: '', priority: 'medium' });
    setShowNewTicket(false);
    
    toast({
      title: 'Ticket Created',
      description: `Your ticket ${ticket.id} has been submitted. We'll respond shortly.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Support Tickets</h2>
          <p className="text-muted-foreground">Manage your support requests</p>
        </div>
        <Button onClick={() => setShowNewTicket(!showNewTicket)}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {showNewTicket && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Ticket</CardTitle>
            <CardDescription>Describe your issue and we'll help you resolve it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input 
                placeholder="Brief description of your issue"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={newTicket.category}
                  onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Orders">Orders</SelectItem>
                    <SelectItem value="Returns">Returns & Refunds</SelectItem>
                    <SelectItem value="Account">Account</SelectItem>
                    <SelectItem value="Technical">Technical Issue</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select 
                  value={newTicket.priority}
                  onValueChange={(value: any) => setNewTicket({ ...newTicket, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="Provide detailed information about your issue..."
                rows={4}
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNewTicket(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTicket}>
                Submit Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(ticket.status)}
                    <span className="text-sm font-medium text-muted-foreground">{ticket.id}</span>
                    <Badge variant="outline" className={getStatusColor(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  <h3 className="font-semibold truncate">{ticket.subject}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {ticket.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {ticket.category}
                    </span>
                    {ticket.assignedTo && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {ticket.assignedTo}
                      </span>
                    )}
                    <span>
                      Created {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
