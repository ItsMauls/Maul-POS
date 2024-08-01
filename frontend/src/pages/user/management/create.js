import MainContainer from "@/components/MainContainer";
import SidebarMenu from "@/components/SidebarMenu";
import RefreshToken from "@/helper/refreshToken";
import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Button, Card, Confirm, Form, FormButton, Grid, Message, Modal } from "semantic-ui-react";

const CreateUser = () => {
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [name , setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [roleID, setRoleID] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !username || !email || !password || !address || !roleID) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(
        {
          name: name,
          username: username,
          email: email,
          password: password,
          address: address,
          role_id: parseInt(roleID),
        }
      ),
    });

    if (res.status === 401) {
      const data = await res.json();
      if (data.message === "TOKEN_EXPIRED") {
        const refreshToken = await RefreshToken();
        if (refreshToken) {
          return handleSubmit(e);
        }
      }
    }

    if (res.status === 403) {
      const data = await res.json();
      setError(data.message);
      setLoading(false);
      return;
    }

    if (res.ok) {
      setSuccess(true);
      setError("");
      setLoading(false);
    } else {
      const data = await res.json();
      setError(data.message);
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/roles`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (res.status === 401) {
        const data = await res.json();
        if (data.message === "TOKEN_EXPIRED") {
          const refreshToken = await RefreshToken();
          if (refreshToken) {
            return fetchRoles();
          }
        }
      }

      if (res.ok) {
        const data = await res.json();
        setRoles(data.data);
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);


  if (loading) {
    return "Loading...";
  }
  
  return (
    <div>
      <SidebarMenu />
      <MainContainer>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <h1>Create User</h1>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Modal open={success} size="mini">
                <Modal.Header>Success</Modal.Header>
                <Modal.Content>
                  <p>User created successfully</p>
                </Modal.Content>
                <Modal.Actions>
                  <Button positive onClick={() => router.push("/user/management/")}>Go to User Management</Button>
                  <Button negative onClick={() => setSuccess(false)}>Close</Button>
                </Modal.Actions>
              </Modal>
              <Card fluid>
                <Card.Content>
                  {error && 
                    <Message negative onDismiss={() => setError("")}>
                      <Message.Header>Error</Message.Header>
                      <p>{error}</p>
                    </Message>
                  }
                  <Form>
                    <Form.Field required={!name}>
                      <label>Name</label>
                      <input value={name} placeholder="Name" onChange={(e) => setName(e.target.value)}/>
                    </Form.Field>
                    <Form.Field required={!username}>
                      <label>Username</label>
                      <input value={username} placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                    </Form.Field>
                    <Form.Field required={!email}>
                      <label>Email</label>
                      <input value={email} type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Field>
                    <Form.Field required={!password}>
                      <label>Password</label>
                      <input value={password} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Field>
                    <Form.Field required={!address}>
                      <label>Address</label>
                      <input value={address} placeholder="Address" onChange={(e) => setAddress(e.target.value)}/>
                    </Form.Field>
                    <Form.Field required={!roleID}>
                      <label>Role</label>
                      <select value={roleID} onChange={(e) => setRoleID(e.target.value)}>
                        <option value="">Select Role</option>
                        {roles.map((role) => {
                          return <option key={role.id} value={role.id}>{role.name}</option>
                        })}
                      </select>
                    </Form.Field>
                    <div style={
                      {
                        marginTop: "20px",
                        display: "flex",
                        justifyContent: "flex-end",
                      }
                    }>
                      <FormButton primary loading={loading} onClick={
                        (e) => handleSubmit(e)
                      }>Submit</FormButton>
                      <FormButton negative onClick={() => router.push("/user/management/")}>Cancel</FormButton>
                    </div>
                  </Form>
                  
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </MainContainer>
    </div>
  );
};
export default CreateUser;
