import React, { useState } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'

const NAV_ITEMS = [
    {
        id: 'technical',
        label: 'Technical Questions',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                    d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        )
    },
    {
        id: 'behavioral',
        label: 'Behavioral Questions',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 8.7 3.9a8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        )
    },
    {
        id: 'roadmap',
        label: 'Road Map',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                    d="M3 3v18h18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="m7 16 4-5 3 3 5-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        )
    }
]

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className='q-card'>
            <div
                className='q-card__header'
                onClick={() => setOpen(o => !o)}
            >
                <span className='q-card__index'>Q{index + 1}</span>

                <p className='q-card__question'>
                    {item.question}
                </p>

                <span
                    className={`q-card__chevron ${
                        open ? 'q-card__chevron--open' : ''
                    }`}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <polyline
                            points="6 9 12 15 18 9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </div>

            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>
                            Intention
                        </span>
                        <p>{item.intention}</p>
                    </div>

                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>
                            Model Answer
                        </span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>
                Day {day.day}
            </span>

            <h3 className='roadmap-day__focus'>
                {day.focus}
            </h3>
        </div>

        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')

    const {
        report,
        loading,
        getResumePdf
    } = useInterview()

    const { interviewId } = useParams()

    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80
            ? 'score--high'
            : report.matchScore >= 60
                ? 'score--mid'
                : 'score--low'

    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                <nav className='interview-nav'>
                    <div className="nav-content">

                        <p className='interview-nav__label'>
                            Sections
                        </p>

                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${
                                    activeNav === item.id
                                        ? 'interview-nav__item--active'
                                        : ''
                                }`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>
                                    {item.icon}
                                </span>

                                {item.label}
                            </button>
                        ))}

                    </div>

                    <button
                        onClick={() => {
                            getResumePdf(interviewId)
                        }}
                        className='button primary-button'
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        Download Resume
                    </button>
                </nav>

                <div className='interview-divider' />

                <main className='interview-content'>

                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>

                                <span className='content-header__count'>
                                    {report.technicalQuestions.length} questions
                                </span>
                            </div>

                            <div className='q-list'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard
                                        key={i}
                                        item={q}
                                        index={i}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>

                                <span className='content-header__count'>
                                    {report.behavioralQuestions.length} questions
                                </span>
                            </div>

                            <div className='q-list'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard
                                        key={i}
                                        item={q}
                                        index={i}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>

                                <span className='content-header__count'>
                                    {report.preparationPlan.length}-day plan
                                </span>
                            </div>

                            <div className='roadmap-list'>
                                {report.preparationPlan.map(day => (
                                    <RoadMapDay
                                        key={day.day}
                                        day={day}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                </main>

                <div className='interview-divider' />

                <aside className='interview-sidebar'>

                    <div className='match-score'>
                        <p className='match-score__label'>
                            Match Score
                        </p>

                        <div
                            className={`match-score__ring ${scoreColor}`}
                        >
                            <span className='match-score__value'>
                                {report.matchScore}
                            </span>

                            <span className='match-score__pct'>
                                %
                            </span>
                        </div>

                        <p className='match-score__sub'>
                            Strong match for this role
                        </p>
                    </div>

                    <div className='sidebar-divider' />

                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>
                            Skill Gaps
                        </p>

                        <div className='skill-gaps__list'>
                            {report.skillGaps.map((gap, i) => (
                                <span
                                    key={i}
                                    className={`skill-tag skill-tag--${gap.severity}`}
                                >
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </aside>

            </div>
        </div>
    )
}

export default Interview