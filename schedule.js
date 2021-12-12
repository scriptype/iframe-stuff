const scheduleContainer = document.getElementById('scheduleContainer')

const getNow = scheduleData => {
  return scheduleData.filter(sD => sD.now == true)[0]
}

const renderSchedule = (schedule) => {
  if (!schedule) {
    return
  }

  const timeLeft = new Date(schedule.start).getTime() - new Date().getTime()
  const div = `
    <div class="overlay-box schedule-box">
      <div class="schedule-box__title">${schedule.title}</div>
      <div class="schedule-box__description">${schedule.desc}</div>
      ${schedule.url ? `<div class="schedule-box__url"><a href="${schedule.url}" target="_blank">${schedule.url}</a></div>` : ''}
      ${timeLeft > 0 ? `<div class="schedule-box__start">in ${Math.floor(timeLeft / 60000)} minutes</div>` : ''}
    </div>
  `
  scheduleContainer.innerHTML = div
}

const getScheduleData = async () => {
  return fetch(`./schedule.json?t=${new Date().getTime()}`)
    .then(r => r.json())
    .then(r => r instanceof Array ? r : [])
}

const scheduleInit = async () => {
  const now = getNow(await getScheduleData())
  renderSchedule(now)
}

setInterval(
  scheduleInit,
  60000
)

scheduleInit()