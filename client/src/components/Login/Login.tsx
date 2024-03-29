import './Login.css';
import { GoogleOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, googleAuthProvider, db } from "../../utils/firebaseConfig";
import React, { useContext, useState } from "react";
import UserContext from "../Contexts/UserContext"
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();


    const logOutUser = async () => {
        try{
            await signOut(auth);
            setUser(null);
        } catch (error){
            console.log(error);
        }
    }
    
    const signInUser = async () => {
        try {
            const googleInfo = await signInWithPopup(auth, googleAuthProvider);
            
            const userObj = {
                id: googleInfo.user.uid,
                name: googleInfo.user.displayName,
                email: googleInfo.user.email
            };
        
              // Fetch the user from Firestore
            const ref = doc(db, "users", userObj.id);
            const snapshot = await getDoc(ref);
        
              if (snapshot.exists()) {
                const userData = snapshot.data();
              } else {
                await setDoc(ref, { ...userObj });
              }
              setUser({ ...userObj });
              navigate('/');
            } catch (error) {
            console.log(error);
        }
    }
  
    return (
        <section className="login section items-center h-screen mt-60">
            <div className='flex flex-col items-center justify-center'>            
                <h1 className='text-xl font-semibold mb-4'>{!user ? 'Login' : 'Logout'}</h1>
                {!user ? (
                    <Button 
                        onClick={signInUser}
                        className="bg-blue-500 hover:bg-blue-700 hover:text-white text-white font-bold py-2 px-4 rounded"
                        type="ghost"
                        shape="round" icon={<GoogleOutlined />} size={'large'}>
                        Sign in with Google
                    </Button>
                ) : (
                    <Button 
                        onClick={logOutUser}
                        className="bg-blue-500 hover:bg-blue-700 hover:text-white text-white font-bold py-2 px-4 rounded"
                        type="ghost"
                        shape="round" icon={<GoogleOutlined />} size={'large'}>
                        Sign out of Google
                    </Button>
                )}
            </div>
        </section>
    );
  };
  
  export default Login;
  