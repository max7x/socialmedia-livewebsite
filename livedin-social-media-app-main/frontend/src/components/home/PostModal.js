import styled from "styled-components";
import React, { useState } from "react";
import { connect } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { apiPostArticle } from "../../apis/api";

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  color: black;
  background-color: rgba(0, 0, 0, 0.8);
  animation: fadeIn 0.3s;
`;

const Content = styled.div`
  width: 100%;
  max-width: 552px;
  background-color: white;
  max-height: 90%;
  overflow: initial;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 32px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: block;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    height: 40px;
    width: 40px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.15);
    svg,
    img {
      pointer-events: none;
    }
  }
  img {
    height: 32px;
    width: 32px;
  }
`;

const SharedContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 12px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  svg,
  img {
    width: 48px;
    height: 48px;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 50%;
  }
  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 1.5;
    margin-left: 5px;
  }
`;

const ShareCreation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px 16px 16px;
`;

const AssetButton = styled.button`
  display: flex;
  align-items: center;
  height: 40px;
  min-width: auto;
  background-color: transparent;
  border: none;
  img {
    width: 32px;
    height: 32px;
  }
`;

const AttachAssets = styled.div`
  align-items: center;
  display: flex;
  padding-right: 8px;
  ${AssetButton} {
    width: 50px;
  }
`;

const PostButton = styled.button`
  border: solid;
  min-width: 60px;
  border-radius: 20px;
  padding-left: 16px;
  padding-right: 16px;
  color: white;
  background: ${(props) => (props.disabled ? "rgba(0,0,0,0.8)" : "#a054ab")};
  border-color: ${(props) => (props.disabled ? "rgba(0,0,0,0.8)" : "#800080")};
  &:hover {
    cursor: ${(props) => (props.disabled ? "default" : "pointer")};
    background: ${(props) => (props.disabled ? "rgba(0,0,0,0.8)" : "#9d27b0")};
  }
  height: 100%;
  margin-right: 0px;
`;

const CancelButton = styled.button`
  min-width: 60px;
  border-radius: 20px;
  margin-right: 12px;
  padding-left: 16px;
  padding-right: 16px;
  background: white;
  color: black;
  height: 100%;
  border: solid;
  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.08);
  }
  border-color: rgba(0, 0, 0, 0.4);
`;

const Editor = styled.div`
  padding: 12px 24px;
  textarea {
    width: 100%;
    min-height: 100px;
    resize: none;
  }

  input {
    width: 100%;
    height: 35px;
    font-size: 16px;
    margin-bottom: 20px;
  }
`;

const UploadImage = styled.div`
  text-align: center;
  img {
    width: 100%;
  }
`;

const PostModal = (props) => {
  const [editorText, setEditorText] = useState("");
  const [shareImage, setSharedImage] = useState("");
  const [assetArea, setAssetArea] = useState("image");

  const switchAssetArea = (area) => {
    setSharedImage("");
    setAssetArea(area);
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    if (image === "" || image === undefined) {
      alert(`not an image, the file is a ${typeof image}`);
      return;
    }
    setSharedImage(image);
  };

  const reset = (e) => {
    setEditorText("");
    setSharedImage("");
    setAssetArea("image");
    props.handleClick(e);
  };

  const postArticle = (e) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) {
      return;
    }
    const formData = new FormData();
    formData.append("image", shareImage);
    formData.append("text", editorText);
    props.postArticle(formData);
    reset(e);
  };

  return (
    <>
      {props.showModal === "open" && (
        <Container>
          <Content>
            <Header>
              <h2>Create a post</h2>
              <CloseIcon onClick={(e) => reset(e)} sx={{ cursor: "pointer" }} />
            </Header>
            <SharedContent>
              <UserInfo>
                {props.user.photoURL ? (
                  <img src={props.user.photoURL} />
                ) : (
                  <img src="/images/user.svg" alt="user" />
                )}
                <span>{props.user.userName}</span>
              </UserInfo>
              <Editor>
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder="What do you want to talk about?"
                  autoFocus={true}
                ></textarea>
                {assetArea === "image" && (
                  <UploadImage>
                    <input
                      type="file"
                      accept="image/gif, image/jpeg, image/png"
                      name="image"
                      id="file"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                    <button>
                      <label htmlFor="file">Select an image to share</label>
                    </button>
                    {shareImage && (
                      <img src={URL.createObjectURL(shareImage)} />
                    )}
                  </UploadImage>
                )}
              </Editor>
            </SharedContent>
            <ShareCreation>
              <AttachAssets>
                <AssetButton onClick={() => switchAssetArea("image")}>
                  <img src="/images/photo-icon.png" alt="icon" />
                </AssetButton>
              </AttachAssets>
              <div>
                <CancelButton onClick={(e) => reset(e)}>Cancel</CancelButton>
                <PostButton
                  onClick={(e) => postArticle(e)}
                  disabled={!editorText && !shareImage ? true : false}
                >
                  Post
                </PostButton>
              </div>
            </ShareCreation>
          </Content>
        </Container>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postArticle: (formData) => apiPostArticle(formData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
