//StarRating.tsx
// Import necessary React and React Native components
import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {styles} from '../utils/styles'; // Import custom styles

// Interface defining the props expected by the StarRating component
interface StarRatingProps {
  starRating: number; // Current number of selected stars
  setStarRating: (rating: number) => void; // Function to update the star rating
}

// Functional component for displaying a star rating system
const StarRating: React.FC<StarRatingProps> = ({starRating, setStarRating}) => {
  // Function to render star icons as touchable elements
  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(rating => (
      <TouchableOpacity
        key={rating} // Unique key for each star
        onPress={() => setStarRating(rating)} // Set the rating to the star index on press
        style={styles.starRatingContainer}>
        <Text
          style={rating <= starRating ? styles.filledStar : styles.emptyStar}>
          ★
        </Text>
      </TouchableOpacity>
    ));
  };

  return <View style={styles.starRatingContainer}>{renderStars()}</View>; // Render the stars within a view container
};

export default StarRating; // Export the StarRating component
