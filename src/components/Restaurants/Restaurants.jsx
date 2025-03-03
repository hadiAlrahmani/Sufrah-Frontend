import { useParams } from 'react-router-dom';

const Restaurants = () => {
  const { id } = useParams();

  if (id) {
    return (
      <div>
        <h1>Restaurant Details</h1>
        <p>Restaurant ID: {id}</p>
        <p>More details about the restaurant and menu will go here.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>All Restaurants</h1>
      <p>List of restaurants will be displayed here.</p>
    </div>
  );
};

export default Restaurants;