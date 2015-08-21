package by.intexsoft.projectmanager.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrimaryKeyJoinColumn;

public class Folder {
	@Id
	@Column(name = "folder_id")
	@GeneratedValue(strategy = GenerationType.AUTO)
	@PrimaryKeyJoinColumn
	public Long id;

	@Column(nullable = false)
	public String name;

	@ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
	@JoinColumn(name = "parent_folder", referencedColumnName = "folder_id")
	public Folder parentFolder;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "parentFolder", 
			cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
	public List<Folder> childFolders = new ArrayList<Folder>();

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "folder",
			cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
	public List<CheckList> checkLists = new ArrayList<CheckList>();
}
