import styled from "@emotion/styled";
import mediaqueries from "@styles/media";

const Blockquote = styled.blockquote`
  transition: ${p => p.theme.colorModeTransition};
  margin: 15px auto 50px;
  color: ${p => p.theme.colors.articleText};
  font-family: ${p => p.theme.fonts.serif};
  font-style: italic;
  ${mediaqueries.tablet`
    margin: 10px auto 35px;
  `};
  & > p {
    font-family: ${p => p.theme.fonts.serif};
    padding-right: 100px;
    padding-bottom: 0;
    margin: 0 auto;
    font-size: 2.2rem;
    line-height: 1.32;
    ${mediaqueries.tablet`
      font-size: 1.8rem;
      padding: 0 100px;
    `};
    ${mediaqueries.phablet`
      font-size: 2.2rem;
      padding: 0 20px 0 20px;
    `};
  }
`;

export default Blockquote;
