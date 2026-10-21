import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, FileUp, CheckCircle, X, Sparkles } from 'lucide-react';
import { fallbackJobs } from '../services/api';

export default function CareersPage() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [activeJobModal, setActiveJobModal] = useState(null);
  const [applyName, setApplyName] = useState('');
  const [applyEmail, setApplyEmail] = useState('');
  const [applyPhone, setApplyPhone] = useState('');
  const [applyFile, setApplyFile] = useState(null);
  const [applySuccess, setApplySuccess] = useState(false);

  const departments = ['all', 'Điều hành Tour', 'Kinh doanh', 'Công nghệ thông tin'];

  const filteredJobs = selectedDept === 'all'
    ? fallbackJobs
    : fallbackJobs.filter(j => j.department === selectedDept);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setActiveJobModal(null);
      setApplyName('');
      setApplyEmail('');
      setApplyPhone('');
      setApplyFile(null);
    }, 2000);
  };

  return (
    <div className="_vt_careersPage_view">
      {/* Apply Modal with File Input (Great Playwright upload exercise!) */}
      {activeJobModal && (
        <div className="_applyModal_overlay" role="dialog" aria-modal="true" onClick={() => setActiveJobModal(null)}>
          <div className="_applyModal_card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveJobModal(null)}
              className="_btnModalClose"
              aria-label="Đóng cửa sổ ứng tuyển"
            >
              <X size={20} />
            </button>

            <div className="_modalJobHeader">
              <span className="_deptBadge">{activeJobModal.department}</span>
              <h2>Ứng Tuyển: {activeJobModal.title}</h2>
              <p>Mức lương: <strong>{activeJobModal.salary}</strong> | Địa điểm: {activeJobModal.location}</p>
            </div>

            {applySuccess ? (
              <div className="_applySuccess_box">
                <CheckCircle size={40} className="_successIcon" />
                <h3>Hồ sơ đã được gửi thành công!</h3>
                <p>Phòng Nhân Sự VietTravel sẽ liên hệ với bạn để sắp xếp lịch phỏng vấn.</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="_applyForm_content">
                <div className="_applyField">
                  <label>Họ và tên của bạn <span className="_reqStar">*</span></label>
                  <input
                    type="text"
                    value={applyName}
                    onChange={(e) => setApplyName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="_applyInput"
                    required
                  />
                </div>

                <div className="_applyField">
                  <label>Email liên hệ <span className="_reqStar">*</span></label>
                  <input
                    type="email"
                    value={applyEmail}
                    onChange={(e) => setApplyEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="_applyInput"
                    required
                  />
                </div>

                <div className="_applyField">
                  <label>Số điện thoại <span className="_reqStar">*</span></label>
                  <input
                    type="tel"
                    value={applyPhone}
                    onChange={(e) => setApplyPhone(e.target.value)}
                    placeholder="0901234567"
                    className="_applyInput"
                    required
                  />
                </div>

                {/* File Upload Input - Targeted for Playwright setInputFiles() testing */}
                <div className="_applyField _fileUploadField">
                  <label>Đính kèm Hồ sơ / CV (PDF, DOCX) <span className="_reqStar">*</span></label>
                  <div className="_fileDropZone">
                    <FileUp size={24} className="_uploadIcon" />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setApplyFile(e.target.files[0])}
                      className="_fileControl_input"
                      required
                    />
                    <span className="_fileName_text">
                      {applyFile ? applyFile.name : "Nhấp hoặc kéo thả file CV của bạn vào đây"}
                    </span>
                  </div>
                </div>

                <button type="submit" className="_btnSubmitApply">
                  <span>Gửi Hồ Sơ Ứng Tuyển</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="_careersHero_banner">
        <div className="_container_inner_wrap _textCenter">
          <span className="_eyebrow_pill">CƠ HỘI NGHỀ NGHIỆP TẠI VIETTRAVEL</span>
          <h1 className="_hero_h1">Gia Nhập Đội Ngũ Tinh Anh Du Lịch 2026</h1>
          <p className="_hero_lead">
            Môi trường năng động, cơ hội du lịch khắp năm châu và chế độ đãi ngộ vượt trội cho nhân tài.
          </p>
        </div>
      </div>

      <div className="_container_inner_wrap _careersMain_content">
        {/* Department Filter Pills */}
        <div className="_deptFilter_pills_row">
          {departments.map(dept => (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDept(dept)}
              className={`_deptPill_btn ${selectedDept === dept ? '_is_selected' : ''}`}
            >
              {dept === 'all' ? 'Tất Cả Phòng Ban' : dept}
            </button>
          ))}
        </div>

        {/* Job Cards Grid */}
        <div className="_jobsGrid_container">
          {filteredJobs.map(job => (
            <div key={job._id} className="_jobCard_box" data-component="job-card">
              <div className="_jobCard_top">
                <span className="_jobDept_badge">{job.department}</span>
                <span className="_jobType_pill">{job.type}</span>
              </div>

              <h3 className="_jobTitle_text">{job.title}</h3>

              <div className="_jobMeta_list">
                <div className="_metaItem">
                  <MapPin size={14} />
                  <span>{job.location}</span>
                </div>
                <div className="_metaItem _salaryHighlight">
                  <DollarSign size={14} />
                  <strong>{job.salary}</strong>
                </div>
              </div>

              <p className="_jobDesc_summary">{job.description}</p>

              <div className="_jobAction_row">
                <button
                  type="button"
                  onClick={() => setActiveJobModal(job)}
                  className="_btnApplyNow_action"
                >
                  <Sparkles size={15} />
                  <span>Ứng Tuyển Ngay</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
