import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import KenButton from '../KenButton';
import { makeStyles, Typography, Button } from '@material-ui/core';
import { RiFilterLine } from 'react-icons/ri';
const useStyles = makeStyles(theme => ({
  padding: {
    padding: '16px',
  },
  btnLabel: {
    fontSize: '14px',
    textTransform:'capitalize'
  },
}));

export default function KenDialog(props) {
  const {
    open,
    toggleOpen,
    handleClose,
    title,
    dialogText,
    negativeButtonText,
    positiveButtonText,
    negativeButtonProps,
    positiveButtonProps,
    disabledPositiveBtn,
    dialogContent,
    dialogActions,
    dividers,
    children,
    titleContainerStyles,
    maxWidth,
    dialogActionProps,
    negativeButtonClick,
    positiveButtonClick,
    positiveButtonLabelProps,
    negativeButtonLabelProps,
    hidePositiveButton,
    hideNegativeButton,
    Component,
    icon,
    innerProps,
    fullWidth = true,
    viewMode = false,
    setEditMode,
    buttonTransform
  } = props;
  const [
    positiveButtonClickChange,
    setPositiveButtonClickChange,
  ] = React.useState(0);

  const compRef = React.useRef();

  const classes = useStyles();
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        style={{ minWidth: '276px' }}
        // fullWidth
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        disableScrollLock={true}
      >
        {title && (
          <DialogTitle
            id="form-dialog-title"
            classes={{ root: classes.padding }}
            className="editbuttonBox"
            style={{ ...titleContainerStyles }}
          >
            {title}
            {viewMode ? (
              <KenButton
                aria-label="close"
                variant="primary"
                onClick={() => setEditMode(true)}
                label={
                  <Typography
                    {...negativeButtonLabelProps}
                    className={classes.btnLabel}
                  >
                    Edit
                  </Typography>
                }
              >
                Edit
              </KenButton>
            ) : null}
          </DialogTitle>
        )}
        {dialogContent || (
          <>
            {dialogText && (
              <DialogContent classes={{ root: classes.padding }}>
                {dialogText && (
                  <DialogContentText>{dialogText}</DialogContentText>
                )}
              </DialogContent>
            )}
          </>
        )}
        <DialogContent classes={{ root: classes.padding }}>
          {children ? children : null}
          {Component && (
            <>
              {/* <Component
                {...innerProps}
                setOnPositiveButtonClick={setOnPositiveButtonClick}
                setOnNegativeButtonClick={setOnNegativeButtonClick}
                // setIsOpen={setIsOpen}
                isOpen={open}
                toggleOpen={toggleOpen}
                ref={compRef}
                positiveButtonClickChange={positiveButtonClickChange}
              /> */}
            </>
          )}
        </DialogContent>
        {dialogActions || (
          <DialogActions {...dialogActionProps}>
            {!hideNegativeButton && (
              <KenButton
                {...negativeButtonProps}
                onClick={negativeButtonClick}
                // onClick={() => {
                //   //   console.log('KenDialog: Negative Button Clikc');
                //   onNegativeButtonClick();
                // }}
                color="primary"
                variant="secondary"
                label={
                  <Typography
                    {...negativeButtonLabelProps}
                    className={classes.btnLabel}
                    style={{textTransform:buttonTransform}}
                  >
                    {negativeButtonText || 'Cancel'}
                  </Typography>
                }
              />
            )}
            {!hidePositiveButton && (
              <KenButton
                className={classes.btnLabel}
                onClick={positiveButtonClick}
                disabled={disabledPositiveBtn}
                positiveButtonText
                // onClick={(e) => {
                //   if (onPositiveButtonClick) {
                //     onPositiveButtonClick(e);
                //   }
                //   setPositiveButtonClickChange(positiveButtonClickChange + 1);
                // }}
                color="primary"
                variant="primary"
                submitIcon={icon}
                {...positiveButtonProps}
                label={
                  <Typography
                    {...positiveButtonLabelProps}
                    className={classes.btnLabel}
                    style={{textTransform:buttonTransform}}
                  >
                    {' '}
                    {positiveButtonText || 'Ok'}
                  </Typography>
                }
              />
            )}
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}
