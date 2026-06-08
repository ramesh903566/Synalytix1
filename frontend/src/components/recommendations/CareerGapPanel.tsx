import { AlertTriangle, FileText, Activity } from 'lucide-react';
import { GapAnalysis } from '../../types/recommendations';

interface CareerGapPanelProps {
  gaps: GapAnalysis;
}

export default function CareerGapPanel({ gaps }: CareerGapPanelProps) {
  const sections = [
    { title: 'Missing Skills', items: gaps.skills, icon: AlertTriangle, color: 'text-amber-500' },
    { title: 'Missing Assets', items: gaps.assets, icon: FileText, color: 'text-blue-500' },
    { title: 'Missing Activities', items: gaps.activities, icon: Activity, color: 'text-purple-500' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#EFEFEF] p-5">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-4">Career Gaps</h3>
      <div className="space-y-4">
        {sections.map(section => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-2">
              <section.icon className={`w-3.5 h-3.5 ${section.color}`} />
              <span className="text-xs font-semibold text-[#1A1A1A]">{section.title}</span>
            </div>
            {section.items.length === 0 ? (
              <p className="text-[10px] text-[#999] ml-5">No gaps detected ✓</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 ml-5">
                {section.items.map((item, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-neutral-100 text-[#666] border border-neutral-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
