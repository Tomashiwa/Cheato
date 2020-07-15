import React, { useContext, useState, useEffect } from "react";

import axios from "axios";
import UserContext from "../context/UserContext";

import "./css/BookmarkButton.css";

function BookmarkButton({ sheet }) {
	const { userData } = useContext(UserContext);
	const [isToggled, setIsToggled] = useState(false);

	const bookmark = () => {
		if (userData.isLoaded && userData.token !== undefined) {
			const userID = userData.user.id;

			axios
				.get(`/api/users/${userID}`)
				.then((res) => {
					const fetchedUser = res.data;
					const newArray = fetchedUser.bookmarks.slice(0, fetchedUser.bookmarks.length);

					let isToggling = false;

					if (newArray.filter((item) => item !== sheet._id).length !== newArray.length) {
						let index = newArray.indexOf(sheet._id);
						newArray.splice(index, 1);
					} else {
						newArray.push(sheet._id);
						isToggling = true;
					}
                    setIsToggled(isToggling);

					axios
						.put(`/api/users/${userID}`, { bookmarks: newArray })
						.then((res) => {
							// console.log("Successful");
							// console.log(res.data);
						})
						.catch((err) => {
							console.log(`Fail to bookmark: ${err}`);
						});
				})
				.catch((err) => {
					console.log(`Fail to fetch user: ${err}`);
				});
		}
	};

	useEffect(() => {
		if(userData.user !== undefined) {
			axios
				.get(`/api/users/${userData.user.id}`)
				.then((res) => {
					const fetchedUser = res.data;
					setIsToggled(fetchedUser.bookmarks.includes(sheet._id));
				})
				.catch((err) => console.log(`Fail to toggle button: ${err}`));
		}
	}, [sheet, userData]);

	return (
		<button className="bookmarkbtn" type="button" onClick={bookmark} disabled={userData.user === undefined}>
            {
                isToggled
                    ? <div className="bookmarkbtn-icon-toggled"></div>
                    : <div className="bookmarkbtn-icon"></div>
            }
		</button>
	);
}

export default BookmarkButton;
