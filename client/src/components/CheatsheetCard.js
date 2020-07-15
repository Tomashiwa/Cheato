import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";

import Rating from "../components/Rating";
import BookmarkButton from "../components/BookmarkButton";

import Card from "reactstrap/lib/Card";
import CardImg from "reactstrap/lib/CardImg";
import Button from "reactstrap/lib/Button";
import CardHeader from "reactstrap/lib/CardHeader";

import "./css/CheatsheetCard.css";

function CheatsheetCard({ sheet }) {
	const [name, setName] = useState("");
	const [nameLoaded, setNameLoaded] = useState(false);
	const history = useHistory();

	const viewCheatsheet = () => {
		history.push(`/view/${sheet._id}`);
	};

	const viewAuthor = () => {
		history.push(`/profile/${sheet.user}`);
	};

	useEffect(() => {
		const userID = sheet.user;

		if (!sheet.isAnonymous) {
			axios
				.get(`/api/users/${userID}`)
				.then((res) => {
					setName(res.data.name);
					setNameLoaded(true);
				})
				.catch((err) => {
					console.log(`Fail to fetch user data: ${err}`);
				});
		} else {
			setName("");
			setNameLoaded(false);
		}
	}, [sheet]);

	return (
		<div className="sheetCard">
			<Card>
				<CardHeader className="sheetCard-title">
					<div className="sheetCard-name">
						<p>{sheet.name}</p>
					</div>

					{nameLoaded ? (
						<Button
							className="sheetCard-author"
							color="link"
							size="sm"
							onClick={viewAuthor}
						>
							{name}
						</Button>
					) : (
						<div></div>
					)}

					<Rating sheet={sheet} />
				</CardHeader>
				<CardImg top onClick={viewCheatsheet} src={sheet.thumbnail} alt="Card image cap" />
				<div className="sheetCard-bookmarkBtn">
					<BookmarkButton sheet={sheet} />
				</div>
			</Card>
		</div>
	);
}

export default CheatsheetCard;
