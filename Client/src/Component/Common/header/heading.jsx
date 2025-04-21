
const Heading = ({ headingList }) => {
    return (
      <thead className="bg-gray-800 text-gray-100 uppercase text-xs dark:bg-gray-800 dark:text-gray-400">
        <tr>
          {headingList.map((item, index) => (
            <th
              key={index}
              className="px-6 py-3 text-center font-semibold text-nowrap border"
            >
              {item}
            </th>
          ))}
        </tr>
      </thead>
    );
  };
  
  export default Heading;
  