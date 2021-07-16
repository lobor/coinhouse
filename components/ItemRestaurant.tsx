import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import ItemReview from "./ItemReview";

export interface Review {
  review: string;
  createdAt: number;
}

export interface Restaurant {
  title: string;
  reviews: Review[];
}

interface ItemRestaurantProps {
  restaurant: Restaurant;
  onAddReview: (params: string) => void;
  onEditReview: (indexReview: number, review: string) => void;
  onToggleEditRestaurant: () => void
}

interface ItemRestaurantState {
  toggleReview: boolean;
  indexReview: number | null;
}

const ItemRestaurant = ({
  restaurant,
  onAddReview,
  onEditReview,
  onToggleEditRestaurant,
}: ItemRestaurantProps) => {
  const { title, reviews } = restaurant;
  const [state, setState] = useState<ItemRestaurantState>({
    toggleReview: false,
    indexReview: null,
  });
  const handleToggleReview = () => {
    const toggleReview = !state.toggleReview;
    setState({
      ...state,
      toggleReview,
      indexReview: toggleReview ? state.indexReview : null,
    });
  };

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: Yup.object({
      review: Yup.string().min(2).required(),
    }),
    initialValues: {
      review:
        (state.indexReview !== null &&
          reviews[state.indexReview] &&
          reviews[state.indexReview].review) ||
        "",
    },
    onSubmit: (values) => {
      if (state.indexReview !== null) {
        onEditReview(state.indexReview, values.review);
      } else {
        onAddReview(values.review);
      }
      handleToggleReview();
      formik.resetForm();
    },
  });

  const toggleEditReview = (indexReview: number) => () => {
    setState({ ...state, indexReview, toggleReview: true });
  };
  return (
    <div className="border border-gray-900 bg-gray-200 px-10 py-5 mb-5">
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold">{title}</span>
        {!state.toggleReview && (
          <button
            className="cursor-pointer text-blue-600 font-bold underline"
            onClick={handleToggleReview}
          >
            Add review
          </button>
        )}
          <button
            className="cursor-pointer text-blue-600 font-bold underline"
            onClick={onToggleEditRestaurant}
          >
            Toggle edit
          </button>
      </div>
      {reviews.map((review, i) => {
        return (
          <ItemReview
            key={`${review.review}${i}`}
            review={review}
            toggleEdit={toggleEditReview(i)}
          />
        );
      })}

      {state.toggleReview && (
        <form onSubmit={formik.handleSubmit}>
          <div
            className="bg-gray-900 mb-5 w-1/2 m-auto"
            style={{ height: "1px" }}
          />
          <div className="font-bold mb-2">Add review</div>
          <div>
            <textarea
              className="w-full border border-gray-900"
              name="review"
              onChange={formik.handleChange}
              rows={5}
              value={formik.values.review}
            ></textarea>
          </div>
          <div className="flex">
            <button
              onClick={handleToggleReview}
              className="border border-gray-900 w-full mr-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white w-full bg-green-700 ml-1"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ItemRestaurant;
