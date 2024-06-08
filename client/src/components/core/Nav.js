import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarIcon } from "@nextui-org/react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
  Divider,
} from "@nextui-org/react";
import RightArrow from "../icons/RightArrow";
import { useAuth } from "../../context/AuthContext";

export const ChevronDown = ({ fill, size, height, width, ...props }) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

export default function Nav({ isInterviewPage, isLandingPage = false }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { authToken, setToken, userInfo, fetchUserInfo } = useAuth();
  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
  };
  const backgroundType = isLandingPage ? "bg-transparent" : "";
  const menuItems = [
    "Home",
    "Features",
    "Job Portal",
    "Resources",
    "Admin Dashboard",
    "Contact",
    "Log Out",
  ];

  // Function to handle logout
  const handleLogout = () => {
    // removing the token from the local storage
    localStorage.removeItem("authToken");
    navigate("/");
  };
  useEffect(() => {
    // If there is no authToken in the context, retrieve it from localStorage
    const storedAuthToken = localStorage.getItem("authToken");
    console.log("inside nav use effect");
    if (storedAuthToken) {
      setToken(storedAuthToken);
      fetchUserInfo(storedAuthToken);
      console.log("inside nav use token effect");
      setShowLogin(false);
      setShowUser(true);
    } else {
      console.log("no token");
      setShowUser(false);
      setShowLogin(true);
      return;
    }
  }, [authToken]);

  return (
    <Navbar
      isBordered
      isBlurred
      shouldHideOnScroll
      onMenuOpenChange={setIsMenuOpen}
      className={`border-y-stone-100 z-index-2 ${backgroundType}`}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href={isInterviewPage ? undefined : "/"} underline="none">
            <p
              color="foreground"
              className="font-extrabold text-transparent bg-clip-text bg-gradient-to-t from-blue-500 to-indigo-600"
            >
              JOBX
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {!isInterviewPage && (
        <NavbarContent
          className="hidden sm:flex gap-5 max-w-xl"
          justify="center"
        >
          <NavbarItem>
            {" "}
            {/* /isActive */}
            <Link
              color="foreground"
              href="/home"
              className="text-sm font-semibold subpixel-antialiased"
            >
              Home
            </Link>
          </NavbarItem>
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 mt-0.5 bg-transparent data-[hover=true]:bg-transparent text-sm font-semibold subpixel-antialiased"
                  radius="sm"
                  variant="light"
                  endContent={icons.chevron}
                >
                  Features
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="JOBX features"
              className="w-[340px] text-indigo-600 text-md font-normal"
              itemClasses={{
                base: "gap-5",
              }}
            >
              <DropdownItem
                key="autoscaling"
                description="ACME scales apps to meet user demand, automagically, based on load."
              >
                Autoscaling
              </DropdownItem>
              <DropdownItem
                key="usage_metrics"
                description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
              >
                Usage Metrics
              </DropdownItem>
              <DropdownItem
                key="production_ready"
                description="ACME runs on ACME, join us and others serving requests at web scale."
              >
                Production Ready
              </DropdownItem>
              <DropdownItem
                key="99_uptime"
                description="Applications stay on the grid with high availability and high uptime guarantees."
              >
                +99% Uptime
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <NavbarItem>
            <Link
              color="foreground"
              href="#"
              className="text-sm font-semibold subpixel-antialiased"
            >
              Resources
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              color="foreground"
              href="#"
              aria-current="page"
              className="text-sm font-semibold subpixel-antialiased"
            >
              Job portal
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              color="foreground"
              href="/Admin"
              aria-current="page"
              className="text-sm font-semibold subpixel-antialiased"
            >
              Admin Dashboard
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              color="foreground"
              href="#"
              className="text-sm font-semibold subpixel-antialiased"
            >
              Contact
            </Link>
          </NavbarItem>
        </NavbarContent>
      )}
      {!isInterviewPage ? (
        <NavbarContent className="w-auto max-w-md" justify="end">
          <NavbarItem>
            {/* <MainBlueButton hrefLink="/" text="Get started" /> */}
            {showUser && userInfo ? (
              <>
                <Dropdown placement="bottom-start">
                  <DropdownTrigger>
                    <Avatar //todo: use User component here
                      showFallback
                      //name={userInfo.username}
                      src="" // put user image url here
                      size="sm" // Adjust the size to your preference (e.g., xs, sm, md, lg, xl)
                      classNames={{
                        base: "bg-slate-300",
                        icon: "text-white/70",
                      }}
                    />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="User Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                      <p className="font-semibold">{userInfo.username}</p>
                      <p className="font-normal">{userInfo.email}</p>
                      <Divider orientation="vertical" />
                    </DropdownItem>

                    <DropdownItem key="profile">My Profile</DropdownItem>
                    <DropdownItem key="configurations">Saved Jobs</DropdownItem>
                    <DropdownItem key="settings">Settings</DropdownItem>
                    <DropdownItem
                      key="logout"
                      color="danger"
                      onClick={handleLogout}
                    >
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </>
            ) : (
              <></>
            )}
            {showLogin && (
              <Button
                as={Link}
                href="/login"
                color="primary"
                variant="bordered"
                size="sm"
                className="text-xs font-semibold text-gray-600 px-4 border-slate-100 border hover:shadow-xl"
              >
                Get started <RightArrow height={8} width={14} />
              </Button>
            )}
          </NavbarItem>
        </NavbarContent>
      ) : (
        <>
          <Popover placement="bottom" showArrow={true}>
            <PopoverTrigger>
              <Button
                color="danger"
                size="sm"
                className="text-slate-500 bg-white border-1 border-slate-300 font-normal p-2 px-4"
              >
                Finish Interview
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="px-1 py-2">
                <div className="text-tiny">Interview still in progress.</div>
                <div className="text-tiny">
                  Are you sure to finish the interview?
                </div>
                <div className="flex justify-end mt-2">
                  <Link href="/home" underline="none">
                    <button className="text-xs text-rose-500 font-semibold bg-none ">
                      Finish Anyway
                    </button>
                  </Link>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </>
      )}

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={index === menuItems.length - 1 ? "danger" : "foreground"}
              className="w-full"
              href={index === menuItems.length - 1 ? "/" : "#"}
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
