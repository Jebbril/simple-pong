// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch, faBell, faS } from "@fortawesome/free-solid-svg-icons";

const TopBar = () => {
  return (
    <header className="header flex justify-center items-center h-16 bg-[var(--mint-color)]
    px-6 ">
      <div className="flex flex-1 justify-center items-center">
        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 w-96 rounded-full border-none focus:outline-none bg-white text-gray-500"
        />
        {/* <FontAwesomeIcon
            icon={faSearch}
            className="text-gray-600 w-[35px] text-lg ml-2 cursor-pointer"
          /> */}
      </div>
    </header>
  );
};

export default TopBar;