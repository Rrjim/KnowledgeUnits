import React, { useState } from "react";

function ButtonSvg(props) {
    function createPaths(pathIcons) {
        return pathIcons.map((pathIcon, index) => (
          <path key={index} fill={pathIcon.fill} d={pathIcon.d} />
        ));
      }
      
    return (
        <a className="btn btn-block" href={props.link}> 
                <i className={props.iClassName}></i> 
                {props.buttonText}
                <svg
                  className={props.svgClass}         
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width={props.width}     //"100"
                  height={props.height}
                  viewBox="0 0 48 48"
                >
                {createPaths(props.pathIcon)}
                </svg>
              </a>
    )
}

export default ButtonSvg