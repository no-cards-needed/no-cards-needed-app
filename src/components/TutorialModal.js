import React, { useState, useEffect } from 'react';
import { setItem, getItem } from '../helpers/localStorageHelper.ts';

import chevronLeft from '../assets/iconsBlack/chevron/left.svg';
import chevronRight from '../assets/iconsWhite/chevron/right.svg';

function Tutorial( props) {

    const { displayTutorial, setDisplayTutorial, kind, wasSkipped, setWasSkipped } = props

    const contentCreateGame = [
        {
            text: 'That’s the place where your friends appear.'
        },
        {
            text: 'Your friends will need this to join the game.'
        },
        {
            text: 'Here you can choose what kind of deck you want to use for your game.'
        },
        {
            text: 'How many Jokers do you want?'
        },
        {
            text: 'Do you need more than one deck to play your game?'
        },
        {
            text: 'You can turn this on, if everyone should get the same amount of cards.'
        },
        {
            text: 'Turn this on, if you want your game to have a drawing pile.'
        }
    ]

    const contentGame = [
        {
            text: 'Here are your hand cards. You’r the only one who can see it.'
        },
        {
            text: 'You can drag your cards onto the play area. (shake, )'
        },
        {
            text: 'You can double tab to get more action possibilities.'
        },
        {
            text: 'Here you can see what your friends are doing.'
        },
        {
            text: 'All cards that are removed out of the game will appear here.'
        },
        {
            text: 'The tricks you take turn up here.'
        }
    ]


    const [ contentInUse, setContentInUse ] = useState(contentCreateGame)

    const [ page, setPage ] = useState(0)
    
    function countDown() {
        if (page > 0) {
            setPage(page - 1) 
        }
      } 
    
    function countUp() {
        if (page < contentInUse.length - 1 ) {
            setPage(page + 1)
        } else {
            setDisplayTutorial(false)
            setPage(0)
        }
    } 

    // if (kind === 'contentCreateGame') {
    //     setContentInUse(contentCreateGame)
    // }

    // useEffect(() => {
    //     console.log(page)
    //   }, [page]);
  

    return (
        <div className="modalBackground" style={{display: displayTutorial ? 'flex' : 'none'}}>
                <div className="modal" id="basicDrop" style={{marginBottom: '64px', padding: '16px'}}>
                    <div className="btn Secondary medium noselect" id="dropSmall" style={{alignSelf: 'flex-end'}} onClick={() => {setDisplayTutorial(false); setWasSkipped(true); setItem('wasSkipped', wasSkipped)}}>
                        <p>SKIP</p>
                    </div>
                    <div className="content-text-container">
                        <div className="tutorial-content">

                        </div>
                        <div className="text-box">
                            <div className="tut">
                                {contentInUse[page].text}
                            </div>
                        </div>
                    </div>
                    <div className="page-bar">
                        <div className="btn Secondary medium noselect" id="dropSmall" onClick={countDown} style={{opacity: page === 0 ? '0' : '1'}}>
                            <img src={chevronLeft} className="iconContainer" alt="" />
                        </div> 
                        <div className="infoTag">
                        {contentInUse.map( (content, i) => (
                                    <div key={i} className="dot" style={{backgroundColor: i === page ? 'var(--vg-0)' : 'var(--vg-40)'}} onClick={() => setPage(i)}/>
                            ))}
                        </div>
                        <div className="btn Primary medium noselect" id="dropSmall" onClick={countUp}>
                            <img src={chevronRight} className="iconContainer" alt="" />
                        </div> 
                    </div>
                </div>
        </div>
    );
  }

export default Tutorial

