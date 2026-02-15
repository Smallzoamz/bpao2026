'use client';

import { useState } from 'react';
import SafeImage from './SafeImage';
import { useLanguage } from '@/context/LanguageContext';

/**
 * OrgChart Component - แสดงผังองค์กรแบบลำดับชั้น
 * 
 * @param {Array} personnel - รายการบุคลากรทั้งหมด
 * @param {Object} content - การตั้งค่าการแสดงผล (title, show_photos, etc.)
 */
export default function OrgChart({ personnel = [], content = {} }) {
    const { language } = useLanguage();
    const [expandedNodes, setExpandedNodes] = useState(new Set());

    // สร้าง tree structure จาก flat data
    const buildTree = (people) => {
        if (!people || people.length === 0) return [];

        // สร้าง map สำหรับหาคนโดย id
        const peopleMap = new Map();
        people.forEach(p => peopleMap.set(p.id, { ...p, children: [] }));

        // หา root nodes (คนที่ไม่มี parent หรือ parent_id เป็น null)
        const roots = [];

        people.forEach(p => {
            const node = peopleMap.get(p.id);
            if (p.parent_id && peopleMap.has(p.parent_id)) {
                // เพิ่มเป็น child ของ parent
                const parent = peopleMap.get(p.parent_id);
                parent.children.push(node);
            } else {
                // เป็น root node
                roots.push(node);
            }
        });

        // เรียงลำดับ children ตาม sort_order
        const sortChildren = (node) => {
            node.children.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            node.children.forEach(sortChildren);
        };
        roots.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        roots.forEach(sortChildren);

        return roots;
    };

    // Toggle expand/collapse สำหรับ node ที่มี children
    const toggleNode = (nodeId) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    };

    // แสดงการ์ดบุคลากร
    const PersonCard = ({ person, isRoot = false, isLast = false }) => {
        const hasChildren = person.children && person.children.length > 0;
        const isExpanded = expandedNodes.has(person.id);
        const name = language === 'TH' ? person.name_th : person.name_en;
        const position = language === 'TH' ? person.position_th : person.position_en;

        return (
            <div className="org-node-wrapper">
                {/* Connection line จาก parent */}
                <div className="org-connector-vertical"></div>

                {/* Person Card */}
                <div
                    className={`org-card ${isRoot ? 'org-card-root' : ''} ${person.is_manager ? 'org-card-manager' : ''}`}
                    onClick={() => hasChildren && toggleNode(person.id)}
                    style={{ cursor: hasChildren ? 'pointer' : 'default' }}
                >
                    {/* Photo */}
                    {content.show_photos !== false && (
                        <div className="org-photo-wrapper">
                            <SafeImage
                                src={person.photo_url}
                                alt={name}
                                className="org-photo"
                            />
                        </div>
                    )}

                    {/* Info */}
                    <div className="org-info">
                        <h4 className="org-name">{name}</h4>
                        <p className="org-position">{position}</p>
                        {person.phone && (
                            <p className="org-phone">📞 {person.phone}</p>
                        )}
                    </div>

                    {/* Expand/Collapse indicator */}
                    {hasChildren && (
                        <div className="org-expand-indicator">
                            <span className={`org-arrow ${isExpanded ? 'expanded' : ''}`}>
                                ▼
                            </span>
                            <span className="org-child-count">
                                {person.children.length}
                            </span>
                        </div>
                    )}
                </div>

                {/* Children */}
                {hasChildren && isExpanded && (
                    <div className="org-children">
                        <div className="org-connector-horizontal"></div>
                        {person.children.map((child, index) => (
                            <PersonCard
                                key={child.id}
                                person={child}
                                isLast={index === person.children.length - 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // สร้าง tree
    const tree = buildTree(personnel);

    // ถ้าไม่มีข้อมูล hierarchy ให้แสดงแบบ grid
    const hasHierarchy = personnel.some(p => p.parent_id);

    if (!hasHierarchy) {
        // Fallback: แสดงแบบ grid ถ้าไม่มีข้อมูล hierarchy
        return (
            <div className="org-chart-fallback">
                <p className="org-no-hierarchy">
                    {language === 'TH'
                        ? '💡 ยังไม่มีข้อมูลลำดับชั้น แสดงแบบรายการ'
                        : '💡 No hierarchy data, showing as list'}
                </p>
                <div className="org-grid">
                    {personnel.map((person) => {
                        const name = language === 'TH' ? person.name_th : person.name_en;
                        const position = language === 'TH' ? person.position_th : person.position_en;

                        return (
                            <div key={person.id} className="org-card org-card-simple">
                                {content.show_photos !== false && (
                                    <div className="org-photo-wrapper">
                                        <SafeImage
                                            src={person.photo_url}
                                            alt={name}
                                            className="org-photo"
                                        />
                                    </div>
                                )}
                                <div className="org-info">
                                    <h4 className="org-name">{name}</h4>
                                    <p className="org-position">{position}</p>
                                    {person.phone && <p className="org-phone">📞 {person.phone}</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="org-chart">
            {/* Title */}
            {content.title && (
                <h3 className="org-chart-title">
                    {language === 'TH' ? content.title_th : content.title_en}
                </h3>
            )}

            {/* Tree */}
            <div className="org-tree">
                {tree.map((root, index) => (
                    <PersonCard
                        key={root.id}
                        person={root}
                        isRoot={true}
                        isLast={index === tree.length - 1}
                    />
                ))}
            </div>
        </div>
    );
}
