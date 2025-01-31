import * as React from 'react';
import { FaBars } from "react-icons/fa";
import AdminSidebar from './AdminSidebar';

class AdminSideBarModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      isMobile: window.matchMedia('(max-width: 600px)').matches
    };
    this.mediaQuery = window.matchMedia('(max-width: 600px)');
  }

  componentDidMount() {
    this.mediaQuery.addEventListener('change', this.handleMediaChange);
  }

  componentWillUnmount() {
    this.mediaQuery.removeEventListener('change', this.handleMediaChange);
  }

  handleMediaChange = (e) => {
    this.setState({ isMobile: e.matches });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const modalStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: this.state.open ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    };

    const contentStyle = {
      
      padding: '20px',
      borderRadius: '4px',
      width: this.state.isMobile ? '100%' : 'auto',
      height: this.state.isMobile ? '100%' : 'auto',
      maxWidth: '90%',
      maxHeight: '90%',
      overflow: 'auto'
    };

    return (
      <div>
        <button 
          onClick={this.handleClickOpen}
          style={{ 
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          <FaBars className='text-3xl text-black' />
        </button>

        <div style={modalStyle} onClick={this.handleClose}>
          <div 
            style={contentStyle} 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className='w-full'>
              <AdminSidebar onClose={this.handleClose} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminSideBarModal;