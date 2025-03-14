import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	Placeholder,
	Button,
	TextControl,
	Toolbar,
	SVG,
	Path,
} from '@wordpress/components';
import { edit } from '@wordpress/icons';
import SHA256 from 'crypto-js/sha256';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import './editor.scss';
import './style.scss';

export const icon = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
	>
		<Path d="M11.9994 4C11.1161 4 10.4001 4.71606 10.4001 5.59937V11.1992C10.4001 12.0826 11.1161 12.7986 11.9994 12.7986C12.8828 12.7986 13.5988 12.0826 13.5988 11.1992V7.47388C15.6155 8.18506 16.9187 10.1443 16.7951 12.2791C16.6714 14.414 15.1507 16.2096 13.0653 16.6831C10.98 17.1566 8.83295 16.1938 7.79944 14.3217C6.76599 12.4496 7.09534 10.1196 8.60718 8.6073C9.23242 7.98206 9.23242 6.96838 8.60718 6.34314C7.98193 5.7179 6.96826 5.7179 6.34302 6.34314C3.64447 9.04181 3.22809 13.2709 5.34839 16.4441C7.46875 19.6173 11.5353 20.8507 15.0611 19.3902C18.587 17.9296 20.5901 14.1818 19.8455 10.4387C19.1008 6.69568 15.8158 3.99988 11.9994 4Z" />
	</SVG>
);

const isValidEmail = ( email ) => {
	return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( email );
};

const getGravatarHash = ( email ) => {
	if ( ! email ) return '';
	const trimmedEmail = email.trim();
	const lowerEmail = trimmedEmail.toLowerCase();
	return SHA256( lowerEmail ).toString();
};

const getGravatarUrl = ( email, size ) => {
	if ( ! email ) return '';
	const hash = getGravatarHash( email );
	// Request 2x size for Retina displays
	return `https://www.gravatar.com/avatar/${ hash }?s=${
		size * 2
	}&default=mp`;
};

const GravatarImage = ( { blockProps = {}, email = '', size = 72 } ) => {
	const imageUrl = getGravatarUrl( email, size );

	return (
		<div { ...blockProps }>
			{ imageUrl && (
				<img
					src={ imageUrl }
					alt={ __( 'User avatar', 'simple-gravatar' ) }
					width={ size }
					height={ size }
				/>
			) }
		</div>
	);
};

const Edit = ( { attributes, setAttributes } ) => {
	const { email, size } = attributes;
	const [ isEditing, setIsEditing ] = useState( ! email );
	const [ tempEmail, setTempEmail ] = useState( email );
	const [ isValid, setIsValid ] = useState( isValidEmail( email ) );

	const blockProps = useBlockProps( {
		style: {
			width: size,
			height: size,
		},
	} );

	const handleEmailChange = ( value ) => {
		setTempEmail( value );
		setIsValid( isValidEmail( value ) );
	};

	const handleSave = () => {
		setAttributes( { email: tempEmail } );
		setIsEditing( false );
	};

	const handleEdit = () => {
		setIsEditing( true );
	};

	return (
		<>
			<BlockControls>
				{ email && (
					<Toolbar
						controls={ [
							{
								icon: edit,
								label: __(
									'Edit email address',
									'simple-gravatar'
								),
								onClick: handleEdit,
							},
						] }
					/>
				) }
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'simple-gravatar' ) }>
					<RangeControl
						label={ __( 'Size', 'simple-gravatar' ) }
						value={ size }
						onChange={ ( value ) =>
							setAttributes( { size: value } )
						}
						min={ 16 }
						max={ 256 }
					/>
				</PanelBody>
			</InspectorControls>
			{ isEditing ? (
				<div { ...blockProps }>
					<Placeholder
						icon={ icon }
						label={ __( 'Simple Gravatar', 'simple-gravatar' ) }
						instructions={ __(
							'Enter an email address to display the associated Gravatar. If no Gravatar is found, a default avatar will be shown.',
							'simple-gravatar'
						) }
					>
						<TextControl
							label={ __( 'Email Address', 'simple-gravatar' ) }
							value={ tempEmail }
							onChange={ handleEmailChange }
							type="email"
							placeholder={ __(
								'Enter email address',
								'simple-gravatar'
							) }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
						<Button
							variant="primary"
							onClick={ handleSave }
							disabled={ ! isValid }
							__next40pxDefaultSize
						>
							{ __( 'Save', 'simple-gravatar' ) }
						</Button>
					</Placeholder>
				</div>
			) : (
				<GravatarImage
					blockProps={ blockProps }
					email={ email }
					size={ size }
				/>
			) }
		</>
	);
};

registerBlockType( 'simple-gravatar/gravatar', {
	icon: {
		src: icon,
		foreground: '#4678eb',
	},
	title: __( 'Simple Gravatar', 'simple-gravatar' ),
	category: 'embed',
	description: __(
		'Display a Gravatar image associated with an email address. If no Gravatar is found, a default avatar will be shown.',
		'simple-gravatar'
	),
	keywords: [
		__( 'avatar', 'simple-gravatar' ),
		__( 'gravatar', 'simple-gravatar' ),
		__( 'profile', 'simple-gravatar' ),
		__( 'user', 'simple-gravatar' ),
		__( 'image', 'simple-gravatar' ),
	],

	attributes: {
		email: {
			type: 'string',
			default: '',
		},
		size: {
			type: 'number',
			default: 72,
		},
	},

	edit: Edit,

	// Let PHP handle the rendering
	save: () => null,

} );
