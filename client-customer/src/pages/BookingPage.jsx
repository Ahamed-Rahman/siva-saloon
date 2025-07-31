import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/BookingPage.css';
import moment from 'moment';
import { FaArrowLeft } from 'react-icons/fa';


const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service');
  const stylistId = searchParams.get('stylist');
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date());
  const [service, setService] = useState(null);
  const [generatedSlots, setGeneratedSlots] = useState([]);
  const [disabledTimes, setDisabledTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [recommendedTime, setRecommendedTime] = useState(null);
  const [smartSlots, setSmartSlots] = useState([]);


  // ✅ Fetch service details
  useEffect(() => {
    if (!serviceId) return;

    axios.get(`http://localhost:5000/api/services/${serviceId}`)
      .then(res => setService(res.data))
      .catch(err => console.error('Failed to load service', err));
  }, [serviceId]);

  // ✅ Generate 15-minute slots
  useEffect(() => {
    const openHour = 9;
    const closeHour = 18;
    const slotStep = 15;
    const slots = [];

    for (let hour = openHour; hour < closeHour; hour++) {
      for (let min = 0; min < 60; min += slotStep) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }

    setGeneratedSlots(slots);
  }, [date]);


  useEffect(() => {
  const rawUser = localStorage.getItem('user');
  if (!rawUser) return;

  const user = JSON.parse(rawUser);
  const userId = user?.uid;
  if (!userId) return;

  axios.get(`/api/users/${userId}/smart-time-slots`)
    .then(res => setSmartSlots(res.data.recommendedSlots || []))
    .catch(err => console.error(err));
}, []);


  // ✅ Fetch unavailable times
  useEffect(() => {
    if (!stylistId || !serviceId || !date || !service?.durationMax) return;

    const dateStr = date.toISOString().split('T')[0];
    setDisabledTimes([]);

    axios.post('http://localhost:5000/api/bookings/unavailable', {
      stylistId,
      date: dateStr,
      serviceId
    }).then(res => {
      const unavailable = res.data.unavailableTimes || [];
      console.log('🟡 Disabled Times from backend:', unavailable); // ✅ Debug log
      setDisabledTimes(unavailable);

      const available = generatedSlots.find((time) => {
        const blockStart = moment(`${dateStr} ${time}`, 'YYYY-MM-DD HH:mm');
        const blockDuration = service.durationMax;
        const step = 15;

        for (let i = 0; i < blockDuration; i += step) {
          const slotToCheck = blockStart.clone().add(i, 'minutes').format('HH:mm');
          if (unavailable.includes(slotToCheck)) return false;
        }

        return true;
      });

      setRecommendedTime(available || null);
    }).catch(err => console.error('Error fetching unavailable slots:', err));
  }, [stylistId, serviceId, date, generatedSlots, service]);

  // ✅ Check availability manually
  const checkAvailability = async (time) => {
    const selectedDate = new Date(date);
    const now = new Date();
    const [hour, minute] = time.split(':');
    const timeDate = new Date(selectedDate);
    timeDate.setHours(parseInt(hour), parseInt(minute), 0);

    if (selectedDate.toDateString() === now.toDateString() && timeDate < now) {
      alert('You cannot book a past time slot.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/bookings/check', {
        stylistId,
        date: selectedDate.toISOString().split('T')[0],
        time,
        serviceId
      });
      setSelectedTime(time);
    } catch {
      alert('Time slot not available');
    }
  };

  // ✅ Confirm booking
  const handleConfirm = async () => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      alert('Login required');
      navigate('/login');
      return;
    }

    const user = JSON.parse(rawUser);
    const bookingData = {
      uid: user.uid,
      stylistId,
      serviceId,
      date: date.toISOString().split('T')[0],
      time: selectedTime,
    };

    navigate('/payment', {
      state: {
        serviceName: service.name,
        amount: service.priceMin,
        bookingData
      }
    });
  };

  return (
    <div className="booking-page">

   <div className="back-button" onClick={() => navigate('/select-stylist')}>
  <FaArrowLeft />
</div>



      <h2>Select Date and Time</h2>
      <div className="booking-container">

        {smartSlots.map(slot => (
  <button onClick={() => setSelectedTime(slot)}>
    ⏰ {slot} (Recommended)
  </button>
))}

        <div className="calendar-box">
          <Calendar
            onChange={setDate}
            value={date}
            minDate={new Date()}
          />
        </div>

        <div className="time-slot-box">
          {generatedSlots.map((time) => {
            const isToday = new Date(date).toDateString() === new Date().toDateString();
            const [hour, minute] = time.split(':');
            const timeDate = new Date(date);
            timeDate.setHours(parseInt(hour), parseInt(minute), 0);

            const isPastTime = isToday && timeDate < new Date();
            let isDurationBlocked = false;

            if (service?.durationMax && disabledTimes.length > 0) {
              const blockStart = moment(`${date.toISOString().split('T')[0]} ${time}`, 'YYYY-MM-DD HH:mm');
              const blockDuration = service.durationMax;
              const step = 15;

              for (let i = 0; i < blockDuration; i += step) {
                const slotToCheck = blockStart.clone().add(i, 'minutes').format('HH:mm');
                console.log(`⛔ Checking ${slotToCheck} against`, disabledTimes); // ✅ Debug log
                if (disabledTimes.includes(slotToCheck)) {
                  isDurationBlocked = true;
                  break;
                }
              }
            }

            const isDisabled = isPastTime || isDurationBlocked;

            return (

              
              <button
                key={time}
                disabled={isDisabled}
                onClick={() => {
                  if (!isDisabled) checkAvailability(time);
                }}
                className={
                  selectedTime === time
                    ? 'selected'
                    : time === recommendedTime
                    ? 'recommended'
                    : ''
                }
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>

      <button
        className="confirm-btn"
        onClick={handleConfirm}
        disabled={!selectedTime}
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default BookingPage;
