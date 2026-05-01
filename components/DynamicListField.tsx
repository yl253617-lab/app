"use client";

import { useState, useEffect } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline"; // 建议安装 heroicons

interface FieldConfig {
  key: string;
  label: string;
  placeholder: string;
}

interface DynamicListFieldProps {
  name: string;
  initialData: string;
  fields: FieldConfig[];
}

export default function DynamicListField({ name, initialData, fields }: DynamicListFieldProps) {
  const [items, setItems] = useState<any[]>([]);

  // 初始化数据解析
  useEffect(() => {
    try {
      const parsed = JSON.parse(initialData || "[]");
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setItems([]);
    }
  }, [initialData]);

  const addItem = () => {
    const newItem = fields.reduce((acc, field) => ({ ...acc, [field.key]: "" }), {});
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, key: string, value: string) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  return (
    <div className="space-y-4">
      {/* 隐藏域：用于将 JSON 字符串随表单提交给 Server Action */}
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      {items.map((item, index) => (
        <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group transition-all hover:bg-white hover:shadow-md">
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="absolute -right-2 -top-2 p-1 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.key} className={f.key === "description" ? "md:col-span-2" : ""}>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">{f.label}</label>
                {f.key === "description" ? (
                  <textarea
                    value={item[f.key] || ""}
                    onChange={(e) => updateItem(index, f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full p-2 bg-white rounded-xl border border-slate-100 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={item[f.key] || ""}
                    onChange={(e) => updateItem(index, f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full p-2 bg-white rounded-xl border border-slate-100 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold hover:border-indigo-400 hover:text-indigo-400 flex items-center justify-center gap-2 transition-all"
      >
        <PlusIcon className="w-4 h-4" />
        添加新项
      </button>
    </div>
  );
}