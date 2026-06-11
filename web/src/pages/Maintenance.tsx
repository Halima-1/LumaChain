import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Activity, CheckCircle2, AlertTriangle, Clock, ArrowUpRight } from 'lucide-react';

const Maintenance = () => {
  const maintenanceLogs = [
    {
      asset: 'SmartInvert 500',
      serial: 'SN-11029384',
      action: 'Inverter diagnostic',
      technician: 'TechCorp Auth#28',
      date: '2026-06-10',
      status: 'In Progress',
      nextDue: '2026-09-10',
    },
    {
      asset: 'LumaPrime Gen 3',
      serial: 'SN-04928174',
      action: 'Panel cleaning & inspection',
      technician: 'SolarServ Auth#12',
      date: '2026-05-28',
      status: 'Completed',
      nextDue: '2026-11-28',
    },
    {
      asset: 'LumaStorage XL',
      serial: 'SN-99281023',
      action: 'Battery capacity test',
      technician: 'EcoTech Auth#41',
      date: '2026-04-15',
      status: 'Completed',
      nextDue: '2026-10-15',
    },
  ];

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Maintenance Sync</h1>
        <p style={{ color: 'var(--text-dim)' }}>Authorized technician logs and scheduled service history for all tracked assets.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        <motion.div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ color: '#FF6B00', background: 'rgba(255,107,0,0.1)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
              <AlertTriangle size={24} />
            </div>
          </div>
          <h3 style={{ fontSize: '14px', color: 'var(--text-dim)', marginBottom: '4px' }}>Pending Service</h3>
          <p style={{ fontSize: '28px', fontWeight: 700 }}>23</p>
        </motion.div>

        <motion.div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ color: '#00FF94', background: 'rgba(0,255,148,0.1)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
              <CheckCircle2 size={24} />
            </div>
          </div>
          <h3 style={{ fontSize: '14px', color: 'var(--text-dim)', marginBottom: '4px' }}>Completed This Month</h3>
          <p style={{ fontSize: '28px', fontWeight: 700 }}>48</p>
        </motion.div>

        <motion.div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ color: 'var(--primary)', background: 'rgba(255,184,0,0.1)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
              <Clock size={24} />
            </div>
          </div>
          <h3 style={{ fontSize: '14px', color: 'var(--text-dim)', marginBottom: '4px' }}>Avg Resolution</h3>
          <p style={{ fontSize: '28px', fontWeight: 700 }}>2.4 days</p>
        </motion.div>
      </div>

      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '32px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Service History</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Asset / Serial</th>
              <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Action</th>
              <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Technician</th>
              <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Date</th>
              <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 0', color: 'var(--text-dim)', fontSize: '14px', fontWeight: 500 }}>Next Due</th>
            </tr>
          </thead>
          <tbody>
            {maintenanceLogs.map((log, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
              >
                <td style={{ padding: '20px 0' }}>
                  <div style={{ fontWeight: 600 }}>{log.asset}</div>
                  <div style={{ fontSize: '12px', color: 'var(--secondary)' }}>{log.serial}</div>
                </td>
                <td style={{ padding: '20px 0', fontSize: '14px' }}>{log.action}</td>
                <td style={{ padding: '20px 0', fontSize: '14px', color: 'var(--text-dim)' }}>{log.technician}</td>
                <td style={{ padding: '20px 0', fontSize: '14px' }}>{log.date}</td>
                <td style={{ padding: '20px 0' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    background: log.status === 'Completed' ? 'rgba(0,255,148,0.1)' : 'rgba(255,107,0,0.1)',
                    color: log.status === 'Completed' ? '#00FF94' : '#FF6B00',
                  }}>
                    {log.status}
                  </span>
                </td>
                <td style={{ padding: '20px 0', fontSize: '14px' }}>{log.nextDue}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', marginTop: '24px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          View Full Log <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Maintenance;