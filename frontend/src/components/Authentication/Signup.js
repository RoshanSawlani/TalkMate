import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'

const Signup = () => {
    const [show, setShow] = useState()
    const [name, setName] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmpassword, setConfirmpassword] = useState()
    const [pic, setPic] = useState(null)
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const history = useHistory()

    const handleClick = () => setShow(!show)

    const postDetails = (pics) => {
        setLoading(true)
        if (pics === undefined) {
            toast({
                title: "Please select an Image!",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });
            return
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData()
            data.append("file", pics)
            data.append("upload_preset", "chat-app")
            data.append("cloud_name", "den2sewl3")
            fetch("https://api.cloudinary.com/v1_1/den2sewl3/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err)
                    setLoading(false);
                })
        } else {
            toast({
                title: "Please select an Image!",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false)
            return
        }
    }
    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: "Please Fill all the Fields!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast({
                title: "Passwords Do Not Match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            const config = {
                headers:{
                    "Content-type": "application/json"
                }
            }
            const {data} = await axios.post("/api/user",{name,email,password,pic},config);
            toast({
                title: "Registration Successful!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false)
            history.push("/chats")
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false)
        }
    }
    return (
        <div>
            <VStack spacing='5px' color="black">
                <FormControl id='first-name' isRequired>
                    <FormLabel>
                        Name
                    </FormLabel>
                    <Input placeholder='Enter Your Name' onChange={(e) => setName(e.target.value)} />
                </FormControl>

                <FormControl id='email' isRequired>
                    <FormLabel>
                        Email
                    </FormLabel>
                    <Input placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} />
                </FormControl>

                <FormControl id='password' isRequired>
                    <FormLabel>
                        Password
                    </FormLabel>
                    <InputGroup>
                        <Input type={show ? "text" : 'password'} placeholder='Enter Your Password' onChange={(e) => setPassword(e.target.value)} />
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={handleClick}>
                                {show ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <FormControl id='password' isRequired>
                    <FormLabel>
                        Confirm Password
                    </FormLabel>
                    <InputGroup>
                        <Input type={show ? "text" : 'password'} placeholder='Confirm Password' onChange={(e) => setConfirmpassword(e.target.value)} />
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={handleClick}>
                                {show ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <FormControl id='pic' isRequired>
                    <FormLabel>
                        Upload Your Picture
                    </FormLabel>
                    <Input type='file' accept='image/*' p={1.5} placeholder='Enter Your Email' onChange={(e) => postDetails(e.target.files[0])} />
                </FormControl>
                <Button colorScheme='blue' width="100%" style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>
                    Sign Up
                </Button>
            </VStack>
        </div>
    )
}

export default Signup