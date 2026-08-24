import {
    FiCheck,
    FiClock,
    FiX,
} from "react-icons/fi";


const STATUS_LABELS = {
    CREATED: "Order Created",
    ASSIGNED: "Agent Assigned",
    PICKED_UP: "Picked Up",
    IN_TRANSIT: "In Transit",
    OUT_FOR_DELIVERY:
        "Out for Delivery",
    DELIVERED: "Delivered",
    FAILED: "Delivery Failed",
};


const TrackingTimeline = ({
    events = [],
}) => {

    if (!events.length) {
        return null;
    }


    /*
     * Make sure events are displayed
     * from oldest to newest.
     */

    const sortedEvents = [
        ...events,
    ].sort(
        (a, b) =>
            new Date(
                a.createdAt || 0
            ) -
            new Date(
                b.createdAt || 0
            )
    );


    const lastIndex =
        sortedEvents.length - 1;


    return (
        <div className="tracking-timeline">

            {sortedEvents.map(
                (
                    event,
                    index
                ) => {

                    const isLast =
                        index ===
                        lastIndex;

                    const isFailed =
                        event.status ===
                        "FAILED";

                    const isCurrent =
                        isLast;

                    const isCompleted =
                        !isCurrent &&
                        !isFailed;


                    const statusLabel =
                        STATUS_LABELS[
                        event.status
                        ] ||
                        String(
                            event.status ||
                            ""
                        )
                            .replaceAll(
                                "_",
                                " "
                            )
                            .replace(
                                /\b\w/g,
                                (char) =>
                                    char.toUpperCase()
                            );


                    const actor =
                        event.updatedBy ||
                        event.actor ||
                        event.createdBy ||
                        "SYSTEM";


                    return (
                        <div
                            className={[
                                "tracking-event",
                                isCompleted
                                    ? "tracking-event-completed"
                                    : "",
                                isCurrent
                                    ? "tracking-event-current"
                                    : "",
                                isFailed
                                    ? "tracking-event-failed"
                                    : "",
                            ]
                                .filter(
                                    Boolean
                                )
                                .join(" ")}
                            key={
                                event._id ||
                                `${event.status}-${index}`
                            }
                        >

                            {/* Marker */}

                            <div className="tracking-event-marker">

                                <span>

                                    {isFailed ? (
                                        <FiX
                                            size={14}
                                        />
                                    ) : isCompleted ||
                                        isCurrent ? (
                                        <FiCheck
                                            size={14}
                                        />
                                    ) : (
                                        <FiClock
                                            size={13}
                                        />
                                    )}

                                </span>

                            </div>


                            {/* Connector */}

                            {!isLast && (
                                <div
                                    className={`tracking-event-line ${isCompleted
                                        ? "completed"
                                        : ""
                                        }`}
                                />
                            )}


                            {/* Content */}

                            <div className="tracking-event-content">

                                <div className="tracking-event-top">

                                    <h3>
                                        {
                                            statusLabel
                                        }
                                    </h3>

                                    {isCurrent && (
                                        <span className="tracking-current-badge">
                                            Current
                                        </span>
                                    )}

                                </div>


                                <div className="tracking-event-date">

                                    {event.createdAt
                                        ? new Date(
                                            event.createdAt
                                        ).toLocaleString(
                                            "en-IN",
                                            {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                            }
                                        )
                                        : "—"}

                                </div>


                                <div className="tracking-event-updated">

                                    Updated by{" "}

                                    <strong>
                                        {
                                            actor
                                        }
                                    </strong>

                                </div>


                                {event.reason && (
                                    <div className="tracking-event-reason">
                                        {
                                            event.reason
                                        }
                                    </div>
                                )}

                            </div>

                        </div>
                    );
                }
            )}

        </div>
    );
};


export default TrackingTimeline;