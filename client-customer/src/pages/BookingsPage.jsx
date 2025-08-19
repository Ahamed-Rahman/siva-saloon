import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../styles/MyBookingsTable.css';
import { FaStar, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


Modal.setAppElement('#root');

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [feedback, setFeedback] = useState({ rating: '', comment: '' });
  const navigate = useNavigate();

  // Grab Firebase user object
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch bookings on mount (and when user.uid changes)
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user.uid) return;
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/bookings/user/${user.uid}`
        );
        setBookings(data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };
    fetchBookings();
  }, [user.uid]);

  // Filters
  const filteredBookings = bookings.filter((b) => {
    if (filter === 'completed') return b.status === 'Completed';
    if (filter === 'pending') return b.status === 'Pending';
    if (filter === 'past')    return new Date(b.date) < new Date();
    return true;
  });

  // Open feedback modal
  const openFeedbackModal = (booking) => {
    setSelectedBooking(booking);
    setFeedbackModalOpen(true);
  };
  const closeModal = () => setFeedbackModalOpen(false);

  // Submit feedback
  const submitFeedback = async () => {
    try {
      await axios.post('http://localhost:5000/api/reviews', {
        bookingId: selectedBooking._id,
        rating: feedback.rating,
        comment: feedback.comment,
      });
      // mark as feedbackGiven in local state
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBooking._id ? { ...b, feedbackGiven: true } : b
        )
      );
      closeModal();
      alert('Thanks for your feedback!');
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      alert('Failed to submit feedback');
    }
  };

  return (
    <div className="bookings-page">

      <div className="back-buttons" onClick={() => navigate('/')}>
                <FaArrowLeft />
              </div>
      <h2> My Bookings</h2>

      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={filter === 'past' ? 'active' : ''}
          onClick={() => setFilter('past')}
        >
          Past
        </button>
      </div>

      <div className="table-container">
        
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="6">No bookings found.</td>
              </tr>
            ) : (
              filteredBookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.serviceId?.name || 'N/A'}</td>
                  <td>{b.date}</td>
                  <td>
                    {b.startTime} – {b.endTime}
                  </td>
                  <td>Rs. {b.serviceId?.price || b.price || '—'}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        b.status === 'Completed' ? 'done' : 'pending'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status === 'Completed' && !b.feedbackGiven ? (
                      <button
                        className="feedback-btn"
                        onClick={() => openFeedbackModal(b)}
                      >
                        Give Feedback
                      </button>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

     
<Modal
  isOpen={feedbackModalOpen}
  onRequestClose={closeModal}
  contentLabel="Feedback Modal"
  className="modal"
  overlayClassName="modal-overlay"
>
  <h3>📝 Rate Your Service</h3>
  <div className="modal-content">
    <div className="star-rating">
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1;
        return (
          <FaStar
            key={i}
            size={30}
            className={
              starValue <= feedback.rating
                ? 'star filled'
                : 'star'
            }
            onMouseEnter={() =>
              setFeedback({ ...feedback, hover: starValue })
            }
            onMouseLeave={() =>
              setFeedback({ ...feedback, hover: null })
            }
            onClick={() =>
              setFeedback({ ...feedback, rating: starValue })
            }
          />
        );
      })}
    </div>

    <label>
      Comments:
      <textarea
        value={feedback.comment}
        onChange={(e) =>
          setFeedback({ ...feedback, comment: e.target.value })
        }
      />
    </label>

    <button className="submit-btn" onClick={submitFeedback}>
      Submit
    </button>
    <button className="cancel-btn" onClick={closeModal}>
      Cancel
    </button>
  </div>
</Modal>
    </div>
  );
};

export default BookingsPage;
