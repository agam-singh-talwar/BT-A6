import { useRouter } from 'next/router';
import { addToHistory } from '@/lib/userData';
import { removeToken, readToken } from '@/lib/authenticate';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { NavDropdown } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { searchHistoryAtom } from '@/store';
import { useAtom } from 'jotai';



export default function MainNav() {
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)
    const [isExpanded, setIsExpanded] = useState(false)
    const router = useRouter();
    let token = readToken();
    let queryString = ""
    const submitForm = async (e) => {
        e.preventDefault();
        const searchField = e.target.search.value;
        router.push(`/artwork?title=true&q=${searchField}`)
        queryString = `title=true&q=${searchField}`
        setSearchHistory(await addToHistory(`title=true&q=${queryString}`))
        setIsExpanded(false)
    }
    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };
    const handleNavLinkClick = () => {
        setIsExpanded(false);
    };
    const logout = () => {
        setIsExpanded(false);
        removeToken();
        router.push('/login');
    };
    return (
        <>
            <Navbar bg="light" expanded={isExpanded} className='fixed-top bg-primary'>
                <Container>
                    <Navbar.Brand>Agam Singh Talwar</Navbar.Brand>
                    <Navbar.Toggle
                        onClick={handleToggle}
                        aria-expanded={isExpanded}
                        aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className={isExpanded ? 'show' : ''}>
                        <Nav className="me-auto" onClick={handleToggle}>
                            <Link legacyBehavior passHref href="/">
                                <Nav.Link onClick={handleNavLinkClick} href="/" active={router.pathname === "/"}>Home</Nav.Link>
                            </Link>
                            {token &&
                                <Link legacyBehavior passHref href="/search">
                                    <Nav.Link onClick={handleNavLinkClick} href="/search" active={router.pathname === "/search"}>Advanced Search</Nav.Link>
                                </Link>
                            }
                        </Nav>
                        {!token &&
                            <Nav>
                                <Link href="/register" passHref legacyBehavior>
                                    <Nav.Link href="/register" active={router.pathname === "/register"}>
                                        Register
                                    </Nav.Link>
                                </Link>
                                <Link href="/login" passHref legacyBehavior>
                                    <Nav.Link href="/login" active={router.pathname === "/login"}>
                                        Login
                                    </Nav.Link>
                                </Link>
                            </Nav>
                        }
                        &nbsp;
                        {token &&
                            <Form className="d-flex" onSubmit={submitForm} >
                                <Form.Control
                                    type="search"
                                    name="search"
                                    placeholder="Search"
                                    className="me-2"
                                    aria-label="Search"
                                />
                                <Button type='submit' variant="outline-success">Search</Button>
                            </Form>
                        }
                        &nbsp;
                        {token &&
                            <Nav>
                                <NavDropdown title={token.userName}>
                                    <Link href="/favourites" passHref legacyBehavior>
                                        <NavDropdown.Item href="/favourites" active={router.pathname === "/favourites"}>Favourites</NavDropdown.Item>
                                    </Link>
                                    <Link href="/history" passHref legacyBehavior>
                                        <NavDropdown.Item href="/history" active={router.pathname === "/history"} >Search History</NavDropdown.Item>
                                    </Link>
                                    <Link legacyBehavior passHref href="/">
                                        <NavDropdown.Item onClick={logout} href="/" active={router.pathname === "/"}>Logout</NavDropdown.Item>
                                    </Link>
                                </NavDropdown>
                            </Nav>
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <br /><br />

        </>
    );
}