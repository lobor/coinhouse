import { useEffect, useRef, useState } from "react";
import millisecondsToMinutes from "date-fns/millisecondsToMinutes";
import minutesToMilliseconds from "date-fns/minutesToMilliseconds";

export interface Review {
  review: string;
  createdAt: number;
}

interface ItemReviewProps {
  review: Review;
  timeLimit?: number; // in minutes
  toggleEdit: () => void;
}

const ItemReview = ({ review, toggleEdit, timeLimit = 5 }: ItemReviewProps) => {
  const timeout = useRef<NodeJS.Timeout>();
  const now = millisecondsToMinutes(Date.now());
  const minuteAgo = now - millisecondsToMinutes(review.createdAt);
  const [canToggleEdit, setCanToggleEdit] = useState(minuteAgo < timeLimit);
  const setOffCanToggleEdit = () => {
    setCanToggleEdit(false);
  };
  useEffect(() => {
    if (canToggleEdit) {
      timeout.current = setTimeout(() => {
        if (timeout.current) {
          clearTimeout(timeout.current);
        }
        setOffCanToggleEdit();
      }, minutesToMilliseconds(timeLimit - minuteAgo));
      return () => {
        if (timeout.current) {
          clearTimeout(timeout.current);
        }
      };
    }
  }, [canToggleEdit, minuteAgo, timeLimit]);
  return (
    <div className="border border-gray-900 bg-gray-300 mb-5 p-3 flex justify-between items-center">
      <span className="text-2xl font-bold">{review.review}</span>
      {canToggleEdit && (
        <button
          className="cursor-pointer text-blue-600 font-bold underline"
          onClick={toggleEdit}
        >
          toggle on edit
        </button>
      )}
    </div>
  );
};

export default ItemReview;
