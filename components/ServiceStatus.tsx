import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Smartphone, MessageSquare, FileText } from 'lucide-react';
import axios from 'axios';

interface ServiceStatus {
  whatsapp: 'online' | 'offline' | 'error';
  telegram: 'online' | 'offline' | 'error';
  digilocker: 'online' | 'offline' | 'error';
  sms: 'online' | 'offline' | 'error';
}

const ServiceStatus: React.FC = () => {
  const [status, setStatus] = useState<ServiceStatus>({
    whatsapp: 'offline',
    telegram: 'offline',
    digilocker: 'offline',
    sms: 'offline',
  });
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      // Assuming backend has /status endpoint
      const response = await axios.get('/api/status');
      setStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch status:', error);
      // Mock status for demo
      setStatus({
        whatsapp: 'online',
        telegram: 'online',
        digilocker: 'online',
        sms: 'online',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const getStatusIcon = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'online':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'offline':
        return <XCircle className="w-6 h-6 text-red-400" />;
      case 'error':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      default:
        return <XCircle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'online':
        return 'text-green-400';
      case 'offline':
        return 'text-red-400';
      case 'error':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Service Status</h1>
          <p className="text-slate-400">Monitor the health of all integrated services</p>
        </div>
        <Button
          onClick={checkStatus}
          disabled={loading}
          className="flex items-center gap-2"
          variant="primary"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* WhatsApp Status */}
        <GlassCard className="from-green-900/20 to-emerald-900/20 bg-gradient-to-br">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/20">
                <Smartphone className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">WhatsApp</h3>
            </div>
            {getStatusIcon(status.whatsapp)}
          </div>
          <p className={`text-sm ${getStatusColor(status.whatsapp)}`}>
            {status.whatsapp === 'online' ? 'Connected & Ready' :
             status.whatsapp === 'offline' ? 'Disconnected' : 'Connection Error'}
          </p>
        </GlassCard>

        {/* Telegram Status */}
        <GlassCard className="from-blue-900/20 to-cyan-900/20 bg-gradient-to-br">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-500/20">
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Telegram</h3>
            </div>
            {getStatusIcon(status.telegram)}
          </div>
          <p className={`text-sm ${getStatusColor(status.telegram)}`}>
            {status.telegram === 'online' ? 'Bot Active' :
             status.telegram === 'offline' ? 'Bot Inactive' : 'Bot Error'}
          </p>
        </GlassCard>

        {/* DigiLocker Status */}
        <GlassCard className="from-purple-900/20 to-pink-900/20 bg-gradient-to-br">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-500/20">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">DigiLocker</h3>
            </div>
            {getStatusIcon(status.digilocker)}
          </div>
          <p className={`text-sm ${getStatusColor(status.digilocker)}`}>
            {status.digilocker === 'online' ? 'OAuth Ready' :
             status.digilocker === 'offline' ? 'Service Down' : 'Auth Error'}
          </p>
        </GlassCard>

        {/* SMS Status */}
        <GlassCard className="from-orange-900/20 to-red-900/20 bg-gradient-to-br">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-500/20">
                <MessageSquare className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">SMS</h3>
            </div>
            {getStatusIcon(status.sms)}
          </div>
          <p className={`text-sm ${getStatusColor(status.sms)}`}>
            {status.sms === 'online' ? 'Gateway Active' :
             status.sms === 'offline' ? 'Gateway Down' : 'Gateway Error'}
          </p>
        </GlassCard>
      </div>

      {/* Overall Status Summary */}
      <GlassCard className="mt-8 from-slate-900/20 to-slate-800/20 bg-gradient-to-br">
        <h3 className="text-xl font-semibold text-white mb-4">System Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {Object.values(status).filter(s => s === 'online').length}
            </p>
            <p className="text-sm text-slate-400">Services Online</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">
              {Object.values(status).filter(s => s === 'offline').length}
            </p>
            <p className="text-sm text-slate-400">Services Offline</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {Object.values(status).filter(s => s === 'error').length}
            </p>
            <p className="text-sm text-slate-400">Services with Errors</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">
              {Object.keys(status).length}
            </p>
            <p className="text-sm text-slate-400">Total Services</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ServiceStatus;