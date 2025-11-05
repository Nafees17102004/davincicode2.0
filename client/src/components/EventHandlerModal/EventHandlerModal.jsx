import React, { useState } from "react";

const EventHandlerModal = ({
  show,
  onClose,
  eventHandlers,
  onAddEventHandler,
  onRemoveEventHandler,
  eventHandler,
}) => {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [functionName, setFunctionName] = useState("");

  const handleAdd = () => {
    if (selectedEvent && functionName.trim()) {
      onAddEventHandler({
        eventId: selectedEvent,
        functionName: functionName.trim(),
      });
      setSelectedEvent("");
      setFunctionName("");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div
            className="modal-header text-white"
            style={{ backgroundColor: "#070C37" }}
          >
            <h5 className="modal-title">Manage Event Handlers</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Add New Event Handler */}
            <div className="row g-3 mb-4 p-3 border rounded bg-light">
              <div className="col-md-5">
                <label className="form-label fw-semibold">Event Handler</label>
                <select
                  className="form-select"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                >
                  {eventHandler &&
                    eventHandler.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-md-5">
                <label className="form-label fw-semibold">Function Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter function name"
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button
                  className="btn text-white w-100"
                  style={{ backgroundColor: "#070C37" }}
                  onClick={handleAdd}
                  disabled={!selectedEvent || !functionName.trim()}
                >
                  <i className="fa fa-plus me-1"></i> Add
                </button>
              </div>
            </div>

            {/* Event Handlers List */}
            <div className="border rounded">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Event Handler</th>
                      <th>Function Name</th>
                      <th>Section Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventHandlers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-3">
                          No event handlers added
                        </td>
                      </tr>
                    ) : (
                      eventHandlers.map((event) => (
                        <tr key={event.id}>
                          <td className="fw-semibold">{event.eventName}</td>
                          <td>
                            <code className="text-primary">
                              {event.functionName}
                            </code>
                          </td>
                          <td>
                            <span
                              className="badge text-white"
                              style={{ backgroundColor: "#070C37" }}
                            >
                              {event.sectionName}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => onRemoveEventHandler(event.id)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHandlerModal;
