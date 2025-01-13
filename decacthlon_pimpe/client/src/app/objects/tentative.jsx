import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Dice({ position, onClick }) {
    const { scene } = useGLTF('/path/to/dice/model.glb');
    const ref = useRef();

    useEffect(() => {
        ref.current.position.set(...position);
    }, [position]);

    return (
        <primitive
            ref={ref}
            object={scene}
            onClick={onClick}
        />
    );
}

function Tentative() {
    const [dices, setDices] = useState([]);
    const [lockedDices, setLockedDices] = useState([]);
    const [notLockedDices, setNotLockedDices] = useState([]);
    const [isAbleToPlay, setIsAbleToPlay] = useState(true);
    const [score, setScore] = useState(0);
    const [lostOnOdd, setLostOnOdd] = useState(false);
    const { camera, gl } = useThree();

    useEffect(() => {
        const initialDices = Array.from({ length: 5 }, (_, i) => ({
            id: i,
            value: Math.floor(Math.random() * 6) + 1,
            position: [i - 2, 0, 0],
        }));
        setDices(initialDices);
        setNotLockedDices(initialDices);
    }, []);

    const handleDiceClick = useCallback((dice) => {
        if (dice.value % 2 === 0) {
            setLockedDices((prev) => [...prev, dice]);
            setNotLockedDices((prev) => prev.filter((d) => d.id !== dice.id));
        } else {
            alert("Seuls les dés de valeur paire peuvent être sélectionnés");
        }
    }, []);

    const calculateScore = useCallback(() => {
        setScore(dices.reduce((acc, dice) => acc + dice.value, 0));
    }, [dices]);

    const checkPlayability = useCallback(() => {
        const lost = notLockedDices.every((dice) => dice.value % 2 === 1);
        if (notLockedDices.length === 0 || lost) {
            setIsAbleToPlay(false);
            if (lost) {
                alert("Every dice is odd, this try is void");
                setLostOnOdd(true);
            }
        }
    }, [notLockedDices]);

    useEffect(() => {
        if (!isAbleToPlay) {
            calculateScore();
        }
    }, [isAbleToPlay, calculateScore]);

    return (
        <Canvas>
            <OrbitControls />
            <hemisphereLight intensity={1.5} groundColor="#757575" />
            <directionalLight position={[0, 2, 0]} intensity={1} />
            {dices.map((dice) => (
                <Dice
                    key={dice.id}
                    position={dice.position}
                    onClick={() => handleDiceClick(dice)}
                />
            ))}
        </Canvas>
    );
}

export default Tentative;
