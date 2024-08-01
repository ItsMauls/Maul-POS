import { useState, useEffect, useLayoutEffect } from "react";
import { Menu, Sidebar, Icon, Button, Divider } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";

function SidebarMenu() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState({});
  const [user, setUser] = useState({});

  useLayoutEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  const handleSubmenuClick = (name) => {
    setSubmenuOpen(prevState => ({ ...prevState, [name]: !prevState[name] }));
  };

  const handleLogout = () => {
    try {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  
    localStorage.clear();
    router.push('/login');
  };


  useEffect(() => {
    // Only run this code on the client side
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
      setVisible(window.innerWidth > 767);
    };

    // Initial check
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div>
      {isMobile && (
        <Button
          onClick={toggleVisibility}
          style={{ position: "fixed", zIndex: 1000, top: 10, right: 10 }}
        >
          <Icon name="bars" b />
        </Button>
      )}
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        vertical
        width="thin"
        visible={visible}
      >

        <Menu.Item >
          <Icon name="user" />
          {user.name}
          {user.role && <p style={{ fontSize: "12px", color: "grey" }}>{user.role.name}</p>}

        </Menu.Item>


        <Link href="/">
          <Menu.Item active={router.pathname === "/"}>
            <Icon name="home" />
            Dashboard
          </Menu.Item>
        </Link>

        <Divider />

        <Menu.Item onClick={() => handleSubmenuClick('user')}>
          <Icon name='user' />
          <Menu.Header>Management User</Menu.Header>
          {submenuOpen.user &&  (
            <Menu.Menu>
              <Link href="/user/management">
                  <Menu.Item active={router.pathname === "/user/management"}>
                    <Icon name="users" />
                    List User
                  </Menu.Item>
              </Link>
              <Link href="/user/management/create">
                  <Menu.Item active={router.pathname === "/user/management/create"}>
                    <Icon name="user plus" />
                    Add User
                  </Menu.Item>
              </Link>
              <Link href="/user/management/role">
                  <Menu.Item active={router.pathname === "/user/management/role"}>
                    <Icon name="user secret" />
                    Role
                  </Menu.Item>
              </Link>
            </Menu.Menu>
          )}
        </Menu.Item>

        <Divider />

        <Link href="/purchase">
          <Menu.Item active={router.pathname === "/purchase"}>
            <Icon name="shipping" />
            Purchase Order
          </Menu.Item>
        </Link>

        <Divider />

        <Menu.Item onClick={handleLogout}>
          <Icon name="sign-out" />
          Logout
        </Menu.Item>

        <Menu.Item>
          <Icon name="setting" />
          Settings
        </Menu.Item>

      </Sidebar>
    </div>
  );
}

export default SidebarMenu;
