import './App.css';

import { getDays, formatDate } from './ext';
import { Personnel } from './personnel';

import leaves from './leaves.json';

import { faCalendar, faCircleChevronLeft, faCircleChevronRight, faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';


function LeaveBlock(props) {
  const element = props.element
  return <div className='subblock'>
    <span style={{ display: "inline-block", width: "30%" }}>{element.date}</span>
    {element.subject} ({element.type === "annual" ? "연가" : "기타"} {element.days}일)
  </div>
}

function App() {
  let startDate = new Date("2024-10-24")
  let endDate = new Date("2026-07-24") // 하루 뒤로 밀어서 쓰기. 즉, 소집 해제 직후 날짜.

  const personnel = new Personnel(startDate)
  let class_ = personnel.getClass(new Date())

  const [date, setDate] = useState(new Date())
  const [progressValue, setProgressValue] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      const maxDelta = (endDate - startDate)
      setProgressValue(100 - ((endDate - new Date()) / maxDelta * 100))
    }, 10);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="App">
      <h2 style={{ marginTop: 0 }}>사복쌤의 계산기</h2>
      <div className="block">
        <table>
          <tbody>
            <tr>
              <td><FontAwesomeIcon icon={faLocationDot} /></td>
              <td><b>서울특별시교육청</b></td>
            </tr>
            <tr>
              <td><FontAwesomeIcon icon={faUser} /></td>
              <td id="salary">{`${class_} ${personnel.getSalary(class_).toLocaleString()} 원`}</td>
            </tr>
            <tr>
              <td><FontAwesomeIcon icon={faCalendar} /></td>
              <td>2024.10.24 - 2026.07.23</td>
            </tr>
          </tbody>
        </table>
        <progress id="progress" min="0" max="100" value={progressValue} style={{ width: "100%" }}></progress>
        <div id="progress-status">
          <b id="dday">{`D-${Math.floor((endDate - new Date()) / (1000 * 60 * 60 * 24))}`}</b>
          <div id="pct">{progressValue.toFixed(7)}%</div>
        </div>
        <div className="subblock row">
          <div className="column" style={{ marginLeft: "-1px", borderRight: "0.5px solid #666666" }}>
            <div className="header">남은 진급일</div>
            <div id="surplusPromotionDays">{personnel.getSurplusPrommotionDays()}</div>
          </div>
          <div className="column" style={{ marginLeft: "-1px", borderRight: "0.5px solid #666666" }}>
            <div className="header">총 근무일</div>
            <div id="totalWorkingDays">{Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))}</div>
          </div>
          <div className="column">
            <div className="header">현재 근무일</div>
            <div id="currentWorkingDays">{personnel.getCurrentWorkingDays()}</div>
          </div>
        </div>
      </div>
      <div className="block">
        <div id="salaryViewSlot">
          <FontAwesomeIcon icon={faCircleChevronLeft} id="beforeBtn" onClick={() => {
            setDate(new Date(date.getFullYear(), date.getMonth() - 1, 15))
          }} />
          <span>
            <div id="dateRangeView">{formatDate(new Date(date.getFullYear(), date.getMonth(), 1))} ~ {formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0))}</div>
            <span id="salaryView">{(() => {
              let salaryPerDay = personnel.getSalary(personnel.getClass(date)) / 30
              let salary = salaryPerDay * getDays(date)
              return `${salary.toLocaleString()} KRW`
            })()}</span>
          </span>
          <FontAwesomeIcon icon={faCircleChevronRight} id="nextBtn" onClick={() => {
            setDate(new Date(date.getFullYear(), date.getMonth() + 1, 15))
          }} />
        </div>
        <div className="subblock row">
          <div className="column" style={{ marginLeft: "-1px", borderRight: "0.5px solid #666666" }}>
            <div className="header">외출</div>
            <div>0</div>
          </div>
          <div className="column" style={{ marginLeft: "-1px", borderRight: "0.5px solid #666666" }}>
            <div className="header">연·반가·기타</div>
            <div>{(() => {
              let year = date.getFullYear()
              let month = date.getMonth()
              let filter = String(year) + "-" + String(month + 1).padStart(2, '0') + "-"

              return leaves.filter(element => {
                return element.date.startsWith(filter) && element.type === "annual"
              }).length
            })()}</div>
          </div>
          <div className="column">
            <div className="header">병가</div>
            <div>0</div>
          </div>
        </div>
      </div>
      <div className='block'>
        <h3 style={{ padding: 0, margin: 0 }}>휴가 내역</h3>
        {(() => {
          let year = date.getFullYear()
          let month = date.getMonth()
          let filter = String(year) + "-" + String(month + 1).padStart(2, '0') + "-"

          return leaves.filter(element => {
            return element.date.startsWith(filter) && element.type === "annual"
          }).map((element, index) => {
            return <LeaveBlock element={element} key={index}/>
          })
        })()}

      </div>
    </div>
  );
}

export default App;
