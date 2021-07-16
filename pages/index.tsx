import Head from "next/head";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ItemRestaurant, { Restaurant } from "../components/ItemRestaurant";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";

const restaurantsQuery = gql`
  query restaurants {
    restaurants {
      title
      reviews
    }
  }
`;

interface HomeState {
  toggleEditReview: boolean;
  indexRestaurant: number | null;
}

export default function Home() {
  const client = useApolloClient();
  const { data, refetch } = useQuery<{ restaurants: Restaurant[] }>(
    restaurantsQuery,
    { fetchPolicy: "cache-only" }
  );

  const [state, setState] = useState<HomeState>({
    toggleEditReview: false,
    indexRestaurant: null,
  });

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().min(2).required(),
    }),
    initialValues: {
      title:
        (data &&
          state.indexRestaurant !== null &&
          data.restaurants[state.indexRestaurant] &&
          data.restaurants[state.indexRestaurant].title) ||
        "",
    },
    onSubmit: (values) => {
      formik.resetForm();
      if (state.indexRestaurant !== null) {
        const restaurantTmp = data ? [...data.restaurants] : [];
        restaurantTmp[state.indexRestaurant] = {
          ...restaurantTmp[state.indexRestaurant],
          ...values,
        };
        toggleEditRestaurant(state.indexRestaurant)()
        client.writeQuery({
          query: restaurantsQuery,
          data: {
            restaurants: restaurantTmp,
          },
        });
      } else {
        client.writeQuery({
          query: restaurantsQuery,
          data: {
            restaurants: [
              ...((data && data.restaurants) || []),
              { ...values, reviews: [] },
            ],
          },
        });
      }
      refetch();
    },
  });

  const handleAddReview = (index: number) => (review: string) => {
    const restaurantTmp = data ? [...data.restaurants] : [];
    restaurantTmp[index] = {
      ...restaurantTmp[index],
      reviews: [
        ...restaurantTmp[index].reviews,
        { review, createdAt: Date.now() },
      ],
    };
    client.writeQuery({
      query: restaurantsQuery,
      data: {
        restaurants: restaurantTmp,
      },
    });
    refetch();
  };

  const toggleEditRestaurant = (indexRestaurant: number) => () => {
    setState({
      ...state,
      indexRestaurant: state.indexRestaurant !== null ? null : indexRestaurant,
      toggleEditReview: !state.toggleEditReview,
    });
  };

  const handleEditReview =
    (index: number) => (indexReview: number, review: string) => {
      const restaurantTmp = data ? [...data.restaurants] : [];
      restaurantTmp[index] = {
        ...restaurantTmp[index],
        reviews: restaurantTmp[index].reviews.map((reviewData, i) => {
          if (i === index) {
            return { ...reviewData, review };
          }
          return reviewData;
        }),
      };
      client.writeQuery({
        query: restaurantsQuery,
        data: {
          restaurants: restaurantTmp,
        },
      });
      refetch();
    };
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="p-5">
        {data &&
          data.restaurants.map((restaurant, i) => {
            const { title, reviews } = restaurant;
            return (
              <ItemRestaurant
                key={`${title}${i}`}
                restaurant={restaurant}
                onToggleEditRestaurant={toggleEditRestaurant(i)}
                onAddReview={handleAddReview(i)}
                onEditReview={handleEditReview(i)}
              />
            );
          })}

        <div>
          <div className="mb-2">
            {state.toggleEditReview && "Edit a restaurant"}
            {!state.toggleEditReview && "Add a new restaurant"}
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-2">
              <input
                className="w-full border border-gray-900"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
              />
              {formik.errors.title && (
                <span className="text-red-600">{formik.errors.title}</span>
              )}
            </div>
            <div className="mb-2">
              <button type="submit" className="text-white w-full bg-green-700">
                {state.toggleEditReview && "Update"}
                {!state.toggleEditReview && "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
