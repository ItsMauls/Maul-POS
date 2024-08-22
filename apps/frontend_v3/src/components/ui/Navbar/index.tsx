
import { Notifications } from "./Notifications";
import { UserProfile } from "./UserProfile";

import { LeftSection } from "./LeftSection";


export const Navbar = ({
  pathName
}: any) => {
  
    return (
      <nav className="pt-3 py-2 px-8 sticky bg-white top-0 z-10 flex justify-between items-center">
        <div className="flex items-center">
           <LeftSection/>
        </div>
        <div className="flex items-center space-x-4">
          <Notifications hasDate/>
          <UserProfile />
        </div>
      </nav>
    );
  };