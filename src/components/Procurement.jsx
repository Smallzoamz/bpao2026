import { procurementProjects } from '@/data/content';

export default function Procurement() {
    return (
        <section className="procurement">
            <div className="container">
                <div className="procurement-content">
                    <div className="procurement-text animate-on-scroll">
                        <h3>ข้อมูลโครงการ<br />และการจัดซื้อจัดจ้าง</h3>
                        <p>
                            ตรวจสอบ ติดตามแผนโครงการต่างๆ และการจัดสรรงบประมาณ
                            การจัดซื้อจัดจ้างขององค์การบริหารส่วนจังหวัดบุรีรัมย์
                            ตามหลักธรรมาภิบาลและความโปร่งใส
                        </p>
                        <div className="procurement-list">
                            {procurementProjects.map((project, i) => (
                                <div key={i} className="procurement-list-item">
                                    <span className="status-badge">เชิญชวน</span>
                                    {project.title}
                                </div>
                            ))}
                        </div>
                        <a href="#" className="btn-outline-gold" style={{ marginTop: '24px', display: 'inline-block' }}>
                            📂 ดูประกาศทั้งหมด
                        </a>
                    </div>
                    <div className="procurement-visual animate-on-scroll animate-delay-2">
                        <div className="budget-card">
                            <div className="budget-header">
                                <div className="budget-header-icon">📊</div>
                                <div>
                                    <h4>รายละเอียดงบประมาณ</h4>
                                    <span className="budget-fiscal">ประจำปีงบประมาณ พ.ศ. 2568</span>
                                </div>
                            </div>

                            <div className="budget-total">
                                <span className="budget-total-label">งบประมาณรวมทั้งสิ้น</span>
                                <span className="budget-total-value">฿ 2,847,650,000</span>
                            </div>

                            <div className="budget-breakdown">
                                <div className="budget-item">
                                    <div className="budget-item-head">
                                        <span className="budget-dot" style={{ background: '#4F8CFF' }}></span>
                                        <span className="budget-item-name">โครงสร้างพื้นฐาน</span>
                                        <span className="budget-item-amount">฿ 1,245.8 ล้าน</span>
                                    </div>
                                    <div className="budget-bar"><div className="budget-bar-fill" style={{ width: '43.7%', background: '#4F8CFF' }}></div></div>
                                </div>
                                <div className="budget-item">
                                    <div className="budget-item-head">
                                        <span className="budget-dot" style={{ background: '#E8A94D' }}></span>
                                        <span className="budget-item-name">การศึกษา</span>
                                        <span className="budget-item-amount">฿ 612.3 ล้าน</span>
                                    </div>
                                    <div className="budget-bar"><div className="budget-bar-fill" style={{ width: '21.5%', background: '#E8A94D' }}></div></div>
                                </div>
                                <div className="budget-item">
                                    <div className="budget-item-head">
                                        <span className="budget-dot" style={{ background: '#5DD9A8' }}></span>
                                        <span className="budget-item-name">สาธารณสุข</span>
                                        <span className="budget-item-amount">฿ 438.5 ล้าน</span>
                                    </div>
                                    <div className="budget-bar"><div className="budget-bar-fill" style={{ width: '15.4%', background: '#5DD9A8' }}></div></div>
                                </div>
                                <div className="budget-item">
                                    <div className="budget-item-head">
                                        <span className="budget-dot" style={{ background: '#FF7A8A' }}></span>
                                        <span className="budget-item-name">สวัสดิการสังคม</span>
                                        <span className="budget-item-amount">฿ 325.1 ล้าน</span>
                                    </div>
                                    <div className="budget-bar"><div className="budget-bar-fill" style={{ width: '11.4%', background: '#FF7A8A' }}></div></div>
                                </div>
                                <div className="budget-item">
                                    <div className="budget-item-head">
                                        <span className="budget-dot" style={{ background: '#A78BFA' }}></span>
                                        <span className="budget-item-name">บริหารทั่วไป</span>
                                        <span className="budget-item-amount">฿ 225.9 ล้าน</span>
                                    </div>
                                    <div className="budget-bar"><div className="budget-bar-fill" style={{ width: '7.9%', background: '#A78BFA' }}></div></div>
                                </div>
                            </div>

                            <div className="budget-footer">
                                <a href="#" className="budget-link">📄 ดูรายละเอียดทั้งหมด →</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
