// App.tsx
import Home from './pages/Home';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
  font-family: Arial, sans-serif;
`;

// const Nav = styled.nav`
//   background: #007bff;
//   padding: 1rem;
//   a {
//     color: white;
//     margin: 0 1rem;
//     text-decoration: none;
//   }
// `;

const App = () => {
  return (
    <Container>
      <Home />
      {/* <Nav>
        <Link to="/">Home</Link>
        <Link to="/posts">Posts</Link>
      </Nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
      </Routes> */}
    </Container>
  );
};

export default App;
