import React from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  Coins,
  Cpu,
  Clock,
  ShieldCheck,
  CheckSquare,
  Square,
  Layers,
  ChevronDown
} from 'lucide-react';
import { TORDocument, TORFilterState } from '../types';

interface TORFilterBarProps {
  tors: TORDocument[];
  filterState: TORFilterState;
  onFilterChange: (newState: TORFilterState) => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export const TORFilterBar: React.FC<TORFilterBarProps> = ({
  tors,
  filterState,
  onFilterChange,
  onResetFilters,
  filteredCount,
  totalCount,
}) => {
  const isAnyFilterActive =
    filterState.searchTerm !== '' ||
    filterState.priceRange !== 'all' ||
    filterState.architecture !== 'all' ||
    filterState.durationLimit !== 'all' ||
    filterState.warrantyYears !== 'all' ||
    filterState.barrierGate !== 'all' ||
    filterState.selectedIds.length < totalCount;

  const toggleSelectAll = () => {
    if (filterState.selectedIds.length === tors.length) {
      // Deselect all except first
      onFilterChange({
        ...filterState,
        selectedIds: [tors[0].id],
      });
    } else {
      // Select all
      onFilterChange({
        ...filterState,
        selectedIds: tors.map((t) => t.id),
      });
    }
  };

  const toggleSelectTor = (id: string) => {
    const exists = filterState.selectedIds.includes(id);
    let newSelected: string[];
    if (exists) {
      // don't allow 0 selection
      if (filterState.selectedIds.length <= 1) return;
      newSelected = filterState.selectedIds.filter((item) => item !== id);
    } else {
      newSelected = [...filterState.selectedIds, id];
    }
    onFilterChange({
      ...filterState,
      selectedIds: newSelected,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3.5 no-print">
      {/* Top row: Search and Filter Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterState.searchTerm}
              onChange={(e) => onFilterChange({ ...filterState, searchTerm: e.target.value })}
              placeholder="ค้นหาข้อกำหนด เช่น ชื่อ TOR, ผู้เสนอราคา, กล้อง 5MP, Edge AI, ไม้กั้น, SLA..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-700 focus:bg-white"
            />
          </div>
          {filterState.searchTerm && (
            <button
              onClick={() => onFilterChange({ ...filterState, searchTerm: '' })}
              className="text-2xs text-slate-500 hover:text-slate-800 underline whitespace-nowrap"
            >
              ล้างคำค้น
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 justify-end">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            แสดง {filteredCount} จาก {totalCount} ฉบับ
          </span>
          {isAnyFilterActive && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างตัวกรองทั้งหมด</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Selectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 text-xs">
        {/* Price Range Filter */}
        <div>
          <label className="text-3xs font-bold text-slate-500 block mb-1 flex items-center gap-1">
            <Coins className="w-3 h-3 text-amber-600" />
            <span>กรอบราคา/งบประมาณ</span>
          </label>
          <select
            value={filterState.priceRange}
            onChange={(e) =>
              onFilterChange({
                ...filterState,
                priceRange: e.target.value as TORFilterState['priceRange'],
              })
            }
            className="w-full text-2xs p-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-800 font-medium"
          >
            <option value="all">ทุกช่วงราคา</option>
            <option value="under1m">ไม่เกิน 1,000,000 บาท</option>
            <option value="1mTo3m">1,000,000 - 3,000,000 บาท</option>
            <option value="above3m">มากกว่า 3,000,000 บาท</option>
          </select>
        </div>

        {/* Architecture Filter */}
        <div>
          <label className="text-3xs font-bold text-slate-500 block mb-1 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-blue-600" />
            <span>สถาปัตยกรรมระบบ</span>
          </label>
          <select
            value={filterState.architecture}
            onChange={(e) =>
              onFilterChange({
                ...filterState,
                architecture: e.target.value as TORFilterState['architecture'],
              })
            }
            className="w-full text-2xs p-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-800 font-medium"
          >
            <option value="all">ทุกสถาปัตยกรรม</option>
            <option value="edge">Edge AI (ประมวลผลที่กล้อง)</option>
            <option value="server">Server-centric (แม่ข่ายกลาง)</option>
            <option value="cluster">HA Cluster / Multi-Gate</option>
          </select>
        </div>

        {/* Duration Filter */}
        <div>
          <label className="text-3xs font-bold text-slate-500 block mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>ระยะเวลาดำเนินงาน</span>
          </label>
          <select
            value={filterState.durationLimit}
            onChange={(e) =>
              onFilterChange({
                ...filterState,
                durationLimit: e.target.value as TORFilterState['durationLimit'],
              })
            }
            className="w-full text-2xs p-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-800 font-medium"
          >
            <option value="all">ทุกระยะเวลา</option>
            <option value="60">ไม่เกิน 60 วัน</option>
            <option value="90">ไม่เกิน 90 วัน</option>
            <option value="120">ไม่เกิน 120 วัน</option>
          </select>
        </div>

        {/* Warranty Filter */}
        <div>
          <label className="text-3xs font-bold text-slate-500 block mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>ระยะเวลารับประกัน</span>
          </label>
          <select
            value={filterState.warrantyYears}
            onChange={(e) =>
              onFilterChange({
                ...filterState,
                warrantyYears: e.target.value as TORFilterState['warrantyYears'],
              })
            }
            className="w-full text-2xs p-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-800 font-medium"
          >
            <option value="all">ทุกระยะรับประกัน</option>
            <option value="2">อย่างน้อย 2 ปี</option>
            <option value="3">อย่างน้อย 3 ปี</option>
            <option value="5">5 ปี (Comprehensive)</option>
          </select>
        </div>

        {/* Barrier Gate Filter */}
        <div>
          <label className="text-3xs font-bold text-slate-500 block mb-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-purple-600" />
            <span>อุปกรณ์ไม้กั้นอัตโนมัติ</span>
          </label>
          <select
            value={filterState.barrierGate}
            onChange={(e) =>
              onFilterChange({
                ...filterState,
                barrierGate: e.target.value as TORFilterState['barrierGate'],
              })
            }
            className="w-full text-2xs p-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-800 font-medium"
          >
            <option value="all">ทั้งหมด (รวม/ไม่รวม)</option>
            <option value="withBarrier">เฉพาะที่มีไม้กั้นอัตโนมัติ</option>
            <option value="withoutBarrier">เฉพาะที่ไม่มีไม้กั้นในสัญญา</option>
          </select>
        </div>
      </div>

      {/* Select/Deselect Pills for each TOR */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
        <span className="text-3xs font-bold text-slate-500 uppercase tracking-wider">
          เลือกฉบับเปรียบเทียบ:
        </span>
        <button
          onClick={toggleSelectAll}
          className="text-2xs font-semibold text-blue-800 hover:text-blue-950 underline px-1"
        >
          {filterState.selectedIds.length === tors.length ? 'ยกเลิกทั้งหมด' : 'เลือกทั้งหมด'}
        </button>

        <div className="flex items-center gap-1.5 flex-wrap">
          {tors.map((t) => {
            const isSelected = filterState.selectedIds.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => toggleSelectTor(t.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-blue-900 text-white border-blue-950 shadow-2xs'
                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {isSelected ? (
                  <CheckSquare className="w-3 h-3 text-amber-300" />
                ) : (
                  <Square className="w-3 h-3 text-slate-400" />
                )}
                <span>{t.code}</span>
                <span className="opacity-75 font-normal">({t.priceFormatted})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
