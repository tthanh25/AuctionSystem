import { Button, Divider, InputAdornment, Paper, TextField } from "@mui/material"
import styles from "./Detail.module.scss"
import classNames from "classnames/bind";
import detailIMG from "~/assets/adorable-pug-puppy-solo-portrait_53876-64821.jpg"
const cx = classNames.bind(styles);
function Detail() {
    return (
        
        <div style={{marginTop:"99px",marginBottom:"99px"}}>
        <Paper className={cx("paper")} elevation={3}>
            <div className={cx("content")}>
                <h2 className={cx("name")}>Detail
               </h2>
                <Divider style={{margin: "16px"}}/>
                <div className={cx("description")}><p>con cho ten meo meo</p>
                </div>
                <img src={detailIMG} alt="con meo" style={{height:"450px"}}></img>
                <Divider style={{margin: "16px"}}/>
                <div className={cx("payment")}>
                <TextField
                fullWidth
                label="Nhập mức đấu giá"
                id="outlined-start-adornment"
                sx={{ m: 1 }}
                InputProps={{
                    endAdornment: <InputAdornment position="end">$</InputAdornment>,
                }}
                />
                <p>Giá hiện tại: 100$ 
                    <br/>
                Mức chênh lệch đấu giá: 10$
                </p>
                </div>
                <Button variant="contained">Xác nhận đấu giá</Button>
            </div>
        </Paper >
   </div>
    );
}

export default Detail;