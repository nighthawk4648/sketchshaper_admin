import { Editor as TinyEditor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { Controller } from 'react-hook-form';
// import Error from '../form/Error';

const TextEditor = ({ name, control, errors, required }) => {
	// Set dark mode preference
	const useDarkMode = false;

	// Image upload handler function
	const handleImageUpload = async (blobInfo, success, failure) => {
		try {
			const formData = new FormData();
			formData.append('src', blobInfo.blob(), blobInfo.filename());

			const { data } = await axios.post(
				// 'https://api.isle.com.bd/api/upload',
				'',
				formData
			);

			return Promise.resolve(data?.data?.abs_url);
		} catch (error) {
			failure('Error uploading image');
		}
	};

	// TinyMCE configuration
	const editorConfig = {
		// Plugins
		plugins:
			'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',

		// Menubar
		menubar: 'file edit view insert format tools table help',

		// Toolbar
		toolbar:
			'undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl',

		// Autosave settings
		autosave_ask_before_unload: true,
		autosave_interval: '30s',
		autosave_prefix: '{path}{query}-{id}-',
		autosave_restore_when_empty: false,
		autosave_retention: '2m',

		// Image settings
		image_advtab: true,
		images_upload_handler: handleImageUpload,

		// Appearance settings
		skin: useDarkMode ? 'oxide-dark' : 'oxide',
		content_css: useDarkMode ? 'dark' : 'default',
		content_style:
			'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',

		// Quickbars settings
		quickbars_selection_toolbar:
			'bold italic | quicklink h2 h3 blockquote quickimage quicktable',

		// Misc settings
		noneditable_class: 'mceNonEditable',
		toolbar_mode: 'sliding',
		contextmenu: 'link image table',

		// Height settings
		height: 500,
	};

	return (
		<div className="z-0 relative">
			<Controller
				name={name}
				control={control}
				render={({ field: { onChange, onBlur, value, ref } }) => (
					<>
						<TinyEditor
							initialValue={value}
							onBlur={(e) => {
								onChange(e.target.getContent());
							}}
							// onEditorBlur={(e) => console.log('Blur', e)}
							tinymceScriptSrc={'/tinymce/tinymce.min.js'}
							init={editorConfig}
						/>
					</>
				)}
				rules={{
					required: required === false ? false : 'Content is required!',
				}}
			/>

			{/* <Error errorName={errors && errors[name]} /> */}
		</div>
	);
};

export default TextEditor;